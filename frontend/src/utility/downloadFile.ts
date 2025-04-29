import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as AssetService } from "@declarations/asset_storage/asset_storage.did";

/**
 * Downloads a file from the asset storage canister
 * @param assetActor The asset storage canister actor
 * @param assetId The ID of the asset to download
 * @param onProgress Optional callback for download progress
 * @returns Object containing the file data, content type, and filename
 */
export const downloadFile = async (
  assetActor: ActorSubclass<AssetService>,
  assetId: string,
  onProgress?: (progress: number) => void
): Promise<{ data: Blob; contentType: string; filename?: string }> => {
  try {

    // First try to get the asset directly (for small files)
    const asset = await assetActor.getAsset(assetId);

    if (asset && Array.isArray(asset) && asset.length > 0) {
      const assetData = asset[0];

      if (assetData && assetData.data && assetData.contentType) {
        if (onProgress) onProgress(100);

        const blob = new Blob([new Uint8Array(assetData.data)], {
          type: assetData.contentType
        });

        return {
          data: blob,
          contentType: assetData.contentType,
          filename: assetData.id
        };
      }
    }

    // If not found as a single asset, check if it's a chunked asset
    console.log("Asset not found as single file, checking chunked assets");
    const chunkedAssetInfo = await assetActor.getChunkedAssetInfo(assetId);

    if (chunkedAssetInfo && Array.isArray(chunkedAssetInfo) && chunkedAssetInfo.length > 0) {
      const assetInfo = chunkedAssetInfo[0];

      if (assetInfo && Array.isArray(assetInfo.chunkIds) && assetInfo.chunkIds.length > 0) {
        const totalChunks = assetInfo.chunkIds.length;

        // Download all chunks
        const chunks = [];
        for (let i = 0; i < assetInfo.chunkIds.length; i++) {
          const chunkId = assetInfo.chunkIds[i];

          const chunk = await assetActor.getChunk(chunkId);

          if (onProgress) {
            onProgress(Math.floor(((i + 1) / totalChunks) * 100));
          }

          if (chunk && Array.isArray(chunk) && chunk.length > 0) {
            // @ts-ignore
            chunks.push(new Uint8Array(chunk[0]));
          }
        }

        if (chunks.length > 0 && assetInfo.contentType) {
          const blob = new Blob(chunks, { type: assetInfo.contentType });

          return {
            data: blob,
            contentType: assetInfo.contentType,
            filename: assetInfo.id
          };
        }
      }
    }

    // If we reach here, the asset was not found or couldn't be processed
    console.error("Asset not found or couldn't be processed:", assetId);
    throw new Error(`Asset with ID ${assetId} not found or couldn't be processed`);
  } catch (error) {
    console.error("Error downloading file:", assetId, error);
    throw error;
  }
};

/**
 * Creates a data URL for an asset that can be used for displaying images
 * @param assetActor The asset storage canister actor
 * @param assetId The ID of the asset
 * @returns Promise with the data URL
 */
export const getAssetDataUrl = async (
  assetActor: ActorSubclass<AssetService>,
  assetId: string
): Promise<string> => {
  try {
    const fileInfo = await downloadFile(assetActor, assetId);

    if (!fileInfo || !fileInfo.data) {
      throw new Error("Failed to download asset");
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read file data"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(fileInfo.data);
    });
  } catch (error) {
    console.error("Error creating data URL:", error);
    throw error;
  }
};

/**
 * Triggers a file download in the browser
 * @param data The file data as a Blob
 * @param filename The name to save the file as
 */
export const triggerDownload = (data: Blob, filename: string): void => {
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};