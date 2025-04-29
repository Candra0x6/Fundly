import { useState } from "react";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as MSMEService } from "@declarations/msme_registration/msme_registration.did";
import { _SERVICE as AssetService } from "@declarations/asset_storage/asset_storage.did";
import { toast } from "react-hot-toast";
import { uploadMSMEDocument } from "@/utility/uploadFile";
import { useMsmeActor } from "@/utility/actors/msmeActor";
import { useStorageActor } from "@/utility/actors/storageActor";

interface UploadOptions {
  entityId: string;
  documentType: string;
  documentName?: string;
  description?: string;
}

interface UploadState {
  progress: number;
  status: string;
  isUploading: boolean;
  preview: string | null;
  reset: () => void;
  assetId: string | null;
}

interface UploadResult {
  assetId: string;
  name: string;
  type: string;
  description: string;
  dateUploaded: string;
}

interface UseFileUploadReturn {
  uploadState: UploadState;
  uploadFile: (file: File, options: UploadOptions) => Promise<UploadResult | null>;
}

export const useFileUpload = (
): UseFileUploadReturn => {
  const msmeActor = useMsmeActor()
  const storageActor = useStorageActor()
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);
  const reset = () => {
    setProgress(0);
    setStatus('');
    setIsUploading(false);
    setPreview(null);
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to create preview"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<UploadResult | null> => {
    try {
      // Reset states and start upload
      setProgress(0);
      setStatus('Preparing upload...');
      setIsUploading(true);

      // Generate preview
      try {
        const previewUrl = await createPreview(file);
        setPreview(previewUrl);
      } catch (error) {
        console.error("Error creating preview:", error);
        // Continue with upload even if preview fails
      }

      // Upload document
      const result = await uploadMSMEDocument(
        msmeActor,
        storageActor,
        file,
        options.entityId,
        options.documentType,
        (uploadProgress: number) => {
          setProgress(uploadProgress);
          setStatus(`Uploading: ${uploadProgress}%`);
        }
      );

      // Update status on success
      setStatus('Upload successful!');
      setAssetId(result.assetId);
      toast.success("File uploaded successfully");

      return {
        assetId: result.assetId,
        name: options.documentName || file.name,
        type: options.documentType,
        description: options.description || "",
        dateUploaded: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      // @ts-ignore
      const errorMessage = error.message || "Unknown error occurred";
      setStatus(`Error: ${errorMessage}`);
      toast.error(`Upload failed: ${errorMessage}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadState: {
      progress,
      status,
      isUploading,
      preview,
      reset,
      assetId
    },
    uploadFile
  };
};