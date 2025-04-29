import { useState, useEffect } from "react";
import { useStorageActor } from "@/utility/actors/storageActor";
import { toast } from "react-hot-toast";

interface FileInfo {
  blob?: Blob;
  contentType?: string;
  fileName?: string;
}

interface AssetPreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
  progress: number;
  fileInfo: FileInfo;
}

export const useAssetPreview = (assetId: string | string[] | null, documentName?: string | null): AssetPreviewResult => {
  const storageActor = useStorageActor();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<FileInfo>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previousAssetId, setPreviousAssetId] = useState<string | string[] | null>(null);

  const getFileExtensionFromType = (contentType?: string): string => {
    if (!contentType) return 'bin';

    switch (contentType) {
      case 'application/pdf': return 'pdf';
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'image/gif': return 'gif';
      case 'application/msword': return 'doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'docx';
      case 'application/vnd.ms-excel': return 'xls';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'xlsx';
      case 'application/vnd.ms-powerpoint': return 'ppt';
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'pptx';
      default: return 'bin';
    }
  };

  const loadAsset = async (id: string) => {
    if (!storageActor || !id) return null;

    try {
      setIsLoading(true);
      setProgress(0);

      // First try to get the asset directly (for small files)
      const asset = await storageActor.getAsset(id);

      if (asset && asset.length > 0 && asset[0]) {
        // Asset was found as a single blob
        const assetData = asset[0];
        setProgress(100);

        if (assetData && assetData.data && assetData.contentType) {
          const blob = new Blob([new Uint8Array(assetData.data)], { type: assetData.contentType });
          const fileName = documentName || `document.${getFileExtensionFromType(assetData.contentType)}`;

          return {
            blob,
            contentType: assetData.contentType,
            fileName
          };
        }
      }

      // If not found as a single asset, check if it's a chunked asset
      const chunkedAssetInfo = await storageActor.getChunkedAssetInfo(id);

      if (chunkedAssetInfo && chunkedAssetInfo.length > 0 && chunkedAssetInfo[0]) {
        const assetInfo = chunkedAssetInfo[0];

        if (assetInfo && Array.isArray(assetInfo.chunkIds) && assetInfo.chunkIds.length > 0) {
          const totalChunks = assetInfo.chunkIds.length;

          // Download all chunks
          const chunks: Uint8Array[] = [];
          for (let i = 0; i < assetInfo.chunkIds.length; i++) {
            const chunkId = assetInfo.chunkIds[i];
            const chunk = await storageActor.getChunk(chunkId);

            setProgress(Math.floor(((i + 1) / totalChunks) * 100));

            if (chunk && chunk.length > 0 && chunk[0]) {
              chunks.push(new Uint8Array(chunk[0]));
            }
          }

          if (chunks.length > 0 && assetInfo.contentType) {
            const blob = new Blob(chunks, { type: assetInfo.contentType });
            const fileName = documentName || `document.${getFileExtensionFromType(assetInfo.contentType)}`;

            return {
              blob,
              contentType: assetInfo.contentType,
              fileName
            };
          }
        }
      }

      return null;
    } catch (error: any) {
      console.error("Error loading asset:", error);
      toast.error(error.message || "Failed to load asset");
      return null;
    }
  };

  // Create preview URL from blob
  const createPreviewUrl = (info: FileInfo) => {
    if (!info.blob) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPreviewUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(info.blob);
  };

  useEffect(() => {
    // Check if assetId has changed
    const hasAssetIdChanged = assetId !== previousAssetId;
    setPreviousAssetId(assetId);

    const loadFirstValidAsset = async () => {
      if (!assetId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // If the assetId has changed and is likely a new upload, add a short delay
        // to allow the backend to fully process the asset
        if (hasAssetIdChanged) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Handle both single assetId and array of assetIds
        const assetIds = Array.isArray(assetId) ? assetId : [assetId];

        // Try to load assets in order until one succeeds
        for (const id of assetIds) {
          const info = await loadAsset(id);
          if (info) {
            setFileInfo(info);
            createPreviewUrl(info);
            break;
          }
        }
      } catch (error) {
        console.error("Error in useAssetPreview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFirstValidAsset();
  }, [assetId]);

  return {
    previewUrl,
    isLoading,
    progress,
    fileInfo
  };
};