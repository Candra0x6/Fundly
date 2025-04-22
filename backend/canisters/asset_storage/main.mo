// Asset Storage Canister
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Time "mo:base/Time";

actor AssetStorage {
    // Types
    public type Asset = {
        id : Text;
        contentType : Text;
        data : Blob;
        owner : Principal;
        createdAt : Time.Time;
        relatedEntity : ?{
            entityType : Text; // "MSME" or "NFT"
            entityId : Text;
        };
    };

    public type AssetError = {
        #NotFound;
        #Unauthorized;
        #StorageFull;
        #ValidationError;
    };

    public type AssetId = Text;
    public type ChunkId = Nat;
    public type ChunkedAsset = {
        id : AssetId;
        contentType : Text;
        chunkIds : [ChunkId];
        totalSize : Nat;
        owner : Principal;
        createdAt : Time.Time;
        relatedEntity : ?{
            entityType : Text;
            entityId : Text;
        };
    };

    // State variables
    private var assets = HashMap.HashMap<AssetId, Asset>(0, Text.equal, Text.hash);
    private var chunkedAssets = HashMap.HashMap<AssetId, ChunkedAsset>(0, Text.equal, Text.hash);
    private var chunks = HashMap.HashMap<ChunkId, Blob>(0, Nat.equal, Hash.hash);
    private stable var nextAssetId : Nat = 0;
    private stable var nextChunkId : Nat = 0;

    // Store a small asset in one piece
    public shared (msg) func storeAsset(
        contentType : Text,
        data : Blob,
        relatedEntity : ?{
            entityType : Text;
            entityId : Text;
        },
    ) : async Result.Result<AssetId, AssetError> {
        let assetId = nextAssetId;
        let idText = Nat.toText(assetId);

        // Check max size (1MB for single-call assets)
        if (Blob.toArray(data).size() > 1_000_000) {
            return #err(#StorageFull);
        };

        let asset : Asset = {
            id = idText;
            contentType = contentType;
            data = data;
            owner = msg.caller;
            createdAt = Time.now();
            relatedEntity = relatedEntity;
        };

        assets.put(idText, asset);
        nextAssetId += 1;
        return #ok(idText);
    };

    // Begin a chunked asset upload
    public shared (msg) func beginChunkedAsset(
        contentType : Text,
        totalSize : Nat,
        relatedEntity : ?{
            entityType : Text;
            entityId : Text;
        },
    ) : async Result.Result<AssetId, AssetError> {
        let assetId = nextAssetId;
        let idText = Nat.toText(assetId);

        // Check max size (10MB for chunked assets)
        if (totalSize > 10_000_000) {
            return #err(#StorageFull);
        };

        let chunkedAsset : ChunkedAsset = {
            id = idText;
            contentType = contentType;
            chunkIds = [];
            totalSize = totalSize;
            owner = msg.caller;
            createdAt = Time.now();
            relatedEntity = relatedEntity;
        };

        chunkedAssets.put(idText, chunkedAsset);
        nextAssetId += 1;
        return #ok(idText);
    };

    // Upload a chunk for a chunked asset
    public shared (msg) func uploadChunk(
        assetId : AssetId,
        data : Blob,
    ) : async Result.Result<ChunkId, AssetError> {
        // Verify owner
        switch (chunkedAssets.get(assetId)) {
            case (null) { return #err(#NotFound) };
            case (?chunkedAsset) {
                if (chunkedAsset.owner != msg.caller) {
                    return #err(#Unauthorized);
                };

                let chunkId = nextChunkId;
                chunks.put(chunkId, data);

                // Update the chunked asset with the new chunk
                let updatedChunkedAsset : ChunkedAsset = {
                    id = chunkedAsset.id;
                    contentType = chunkedAsset.contentType;
                    chunkIds = Array.append(chunkedAsset.chunkIds, [chunkId]);
                    totalSize = chunkedAsset.totalSize;
                    owner = chunkedAsset.owner;
                    createdAt = chunkedAsset.createdAt;
                    relatedEntity = chunkedAsset.relatedEntity;
                };

                chunkedAssets.put(assetId, updatedChunkedAsset);
                nextChunkId += 1;
                return #ok(chunkId);
            };
        };
    };

    // Get asset by ID
    public query func getAsset(id : AssetId) : async ?Asset {
        return assets.get(id);
    };

    // Get chunked asset metadata by ID
    public query func getChunkedAssetInfo(id : AssetId) : async ?ChunkedAsset {
        return chunkedAssets.get(id);
    };

    // Get a chunk by ID
    public query func getChunk(chunkId : ChunkId) : async ?Blob {
        return chunks.get(chunkId);
    };
};
