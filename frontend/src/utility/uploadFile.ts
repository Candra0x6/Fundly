import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as MSMEService } from "@declarations/msme_registration/msme_registration.did";
import { _SERVICE as AssetService } from "@declarations/asset_storage/asset_storage.did";

// Function to split file into chunks
const chunkFile = (file: File, chunkSize: number = 500000): Promise<ArrayBuffer[]> => {
  return new Promise((resolve, reject) => {
    const chunks: ArrayBuffer[] = [];
    const reader = new FileReader();
    let offset = 0;

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (e.target?.result) {
        chunks.push(e.target.result as ArrayBuffer);
        offset += chunkSize;

        if (offset < file.size) {
          readNextChunk();
        } else {
          resolve(chunks);
        }
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    readNextChunk();
  });
};

// Convert DocumentType from string to Motoko variant
const getDocumentType = (type: string) => {
  switch (type) {
    case "BusinessRegistration":
      return { BusinessRegistration: null };
    case "FinancialStatement":
      return { FinancialStatement: null };
    case "TaxDocument":
      return { TaxDocument: null };
    case "ImpactReport":
      return { ImpactReport: null };
    case "TeamProfile":
      return { TeamProfile: null };
    case "BusinessPlan":
      return { BusinessPlan: null };
    default:
      return { Other: type };
  }
};

// Upload document to Asset Storage and add reference to MSME canister
export const uploadMSMEDocument = async (
  msmeActor: ActorSubclass<MSMEService>,
  assetActor: ActorSubclass<AssetService>,
  file: File,
  msmeId: string,
  documentType: string,
  onProgress?: (progress: number) => void
): Promise<{ assetId: string }> => {
  try {
    // Determine if we should use chunked upload based on file size
    const useChunkedUpload = file.size > 1_000_000; // 1MB threshold
    let assetId: string;

    if (useChunkedUpload) {
      // Step 1: Begin chunked asset upload
      const beginResult = await assetActor.beginChunkedAsset(
        file.type,
        BigInt(file.size),
        [{
          entityType: "MSME",
          entityId: msmeId
        }]
      );

      if ('err' in beginResult) {
        throw new Error(`Failed to begin chunked upload: ${JSON.stringify(beginResult.err)}`);
      }

      assetId = beginResult.ok;

      // Step 2: Split file into chunks and upload each chunk
      const chunks = await chunkFile(file);
      const totalChunks = chunks.length;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const uploadResult = await assetActor.uploadChunk(
          assetId,
          new Uint8Array(chunk)
        );

        if ('err' in uploadResult) {
          throw new Error(`Failed to upload chunk ${i + 1}/${totalChunks}: ${JSON.stringify(uploadResult.err)}`);
        }

        // Report progress
        if (onProgress) {
          onProgress(Math.floor(((i + 1) / totalChunks) * 100));
        }
      }
    } else {
      // For small files, use direct upload
      const reader = new FileReader();
      const dataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const data = await dataPromise;

      const storeResult = await assetActor.storeAsset(
        file.type,
        new Uint8Array(data),
        [{
          entityType: "MSME",
          entityId: msmeId
        }]
      );

      if ('err' in storeResult) {
        throw new Error(`Failed to store asset: ${JSON.stringify(storeResult.err)}`);
      }

      assetId = storeResult.ok;

      if (onProgress) {
        onProgress(100);
      }
    }

    // Step 3: Add document reference to MSME

    return {
      assetId: assetId,
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};