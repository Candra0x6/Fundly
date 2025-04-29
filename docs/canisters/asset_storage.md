# Asset Storage Canister

## Overview

The Asset Storage Canister provides file storage functionality for the Fundly platform. It allows users to store and retrieve digital assets such as MSME documents, NFT images, and other platform-related files.

## Key Features

- Small file storage (up to 1MB) in a single call
- Chunked uploads for larger files (up to 10MB)
- Content type metadata
- Asset ownership tracking
- Entity relationship tracking (linking assets to MSMEs or NFTs)

## Data Models

### Asset

Represents a small file that can be stored in a single operation:

```motoko
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
```

### ChunkedAsset

For larger files that need to be uploaded in multiple chunks:

```motoko
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
```

### AssetError

```motoko
public type AssetError = {
    #NotFound;
    #Unauthorized;
    #StorageFull;
    #ValidationError;
};
```

## Public API Methods

### Store Asset (Single Operation)

```motoko
storeAsset(
    contentType : Text,
    data : Blob,
    relatedEntity : ?{
        entityType : Text;
        entityId : Text;
    },
) : async Result.Result<AssetId, AssetError>
```

Stores a small asset (up to 1MB) in a single operation. Returns the Asset ID on success or an error.

### Begin Chunked Asset Upload

```motoko
beginChunkedAsset(
    contentType : Text,
    totalSize : Nat,
    relatedEntity : ?{
        entityType : Text;
        entityId : Text;
    },
) : async Result.Result<AssetId, AssetError>
```

Initiates a chunked upload for larger files. Returns an Asset ID to be used in subsequent chunk uploads.

### Upload Chunk

```motoko
uploadChunk(
    assetId : AssetId,
    data : Blob,
) : async Result.Result<ChunkId, AssetError>
```

Uploads a chunk of data for a previously initiated chunked asset. Returns the Chunk ID on success.

### Get Asset

```motoko
getAsset(id : AssetId) : async ?Asset
```

Retrieves a complete asset by ID. Returns null if the asset doesn't exist.

### Get Chunked Asset Info

```motoko
getChunkedAssetInfo(id : AssetId) : async ?ChunkedAsset
```

Retrieves metadata about a chunked asset without the actual data. Returns null if not found.

### Get Chunk

```motoko
getChunk(chunkId : ChunkId) : async ?Blob
```

Retrieves a specific chunk of data by chunk ID. Returns null if not found.

## Usage Examples

### Storing a Small File

```motoko
// Store an image for an NFT
let result = await AssetStorage.storeAsset(
    "image/png",
    pngData, // Blob containing the image data
    ?{
        entityType = "NFT";
        entityId = "123";
    }
);

switch (result) {
    case (#ok(assetId)) {
        // Use assetId as a reference to the stored asset
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Uploading a Large File in Chunks

```motoko
// Step 1: Begin the chunked upload
let initResult = await AssetStorage.beginChunkedAsset(
    "application/pdf",
    5_000_000, // 5MB file
    ?{
        entityType = "MSME";
        entityId = "MSME123";
    }
);

let assetId = switch (initResult) {
    case (#ok(id)) { id };
    case (#err(error)) {
        return; // Handle error
    };
};

// Step 2: Upload chunks
for (chunk in chunks.vals()) {
    let chunkResult = await AssetStorage.uploadChunk(assetId, chunk);

    switch (chunkResult) {
        case (#err(error)) {
            return; // Handle error
        };
        case (#ok(_)) { /* Continue */ };
    };
}

// Step 3: Use the asset ID for referencing the complete file
```

### Retrieving an Asset

```motoko
let assetOpt = await AssetStorage.getAsset("asset123");

switch (assetOpt) {
    case (?asset) {
        // Use asset.data (Blob) and asset.contentType
    };
    case (null) {
        // Asset not found
    };
}
```

### Retrieving a Chunked Asset

```motoko
// First get the chunked asset info
let assetInfoOpt = await AssetStorage.getChunkedAssetInfo("asset456");

switch (assetInfoOpt) {
    case (?assetInfo) {
        // Get each chunk and combine them
        var fileData = Buffer.Buffer<Nat8>(assetInfo.totalSize);

        for (chunkId in assetInfo.chunkIds.vals()) {
            let chunkOpt = await AssetStorage.getChunk(chunkId);

            switch (chunkOpt) {
                case (?chunk) {
                    let chunkBytes = Blob.toArray(chunk);
                    for (byte in chunkBytes.vals()) {
                        fileData.add(byte);
                    };
                };
                case (null) {
                    // Handle missing chunk
                };
            };
        };

        // Now fileData contains the complete file
    };
    case (null) {
        // Asset not found
    };
}
```

## Implementation Details

### Storage

The Asset Storage canister uses three main storage structures:

- `assets`: HashMap mapping AssetId to Asset objects
- `chunkedAssets`: HashMap mapping AssetId to ChunkedAsset metadata
- `chunks`: HashMap mapping ChunkId to raw data Blobs

### Size Limits

- Single-call assets: 1MB maximum
- Chunked assets: 10MB maximum
- Individual chunks: Size not explicitly limited, but should be reasonable (e.g., 500KB)

### Security

- Asset ownership is tracked by the `owner` field
- Only the owner can modify or delete their assets
- The canister automatically associates the caller's principal with uploaded assets

## Best Practices

### For Uploading Assets

1. **Choose the right method**:

   - For files under 1MB, use `storeAsset`
   - For larger files, use the chunked upload approach

2. **Set proper content types**:

   - Use standard MIME types (e.g., "image/png", "application/pdf")
   - This helps clients render the assets correctly

3. **Link assets to entities**:
   - Always provide the `relatedEntity` parameter when possible
   - This makes it easier to find and manage assets related to specific entities

### For Retrieving Assets

1. **Check existence before processing**:

   - Methods return optional types, always check if the result is null

2. **Handle chunked assets efficiently**:
   - For large files, consider streaming chunks to the client
   - Process chunks as they arrive rather than waiting for all chunks

## Canister Interactions

The Asset Storage canister is used by:

- **MSME Registration**: For storing verification documents
- **NFT Canister**: For storing NFT images
- **Verification Workflow**: For accessing MSME documents
- **Frontend**: For displaying images and documents to users
