;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStorageActor } from "@/utility/actors/storageActor";
import { Download, FileText, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentViewerProps {
  assetId: string;
  documentName: string;
  documentType: string;
}

export function DocumentViewer({ assetId, documentName, documentType }: DocumentViewerProps) {
  const storageActor = useStorageActor();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    blob?: Blob;
    contentType?: string;
    fileName?: string;
  }>({});

  // Helper function to get file extension from MIME type
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

  // Trigger a download
  const triggerDownload = () => {
    if (!fileInfo.blob || !fileInfo.fileName) {
      toast.error("File not loaded yet");
      return;
    }

    const url = URL.createObjectURL(fileInfo.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Download complete!");
  };

  // Load the document
  const loadDocument = async () => {
    if (!storageActor || !assetId) return;

    try {
      setIsLoading(true);
      setProgress(0);

      // First try to get the asset directly (for small files)
      const asset = await storageActor.getAsset(assetId);
      console.log("Asset response:", asset);


      if (asset && asset.length > 0 && asset[0]) {
        // Asset was found as a single blob
        const assetData = asset[0];
        setProgress(100);

        if (assetData && assetData.data && assetData.contentType) {
          const blob = new Blob([new Uint8Array(assetData.data)], { type: assetData.contentType });
          const fileName = documentName || `document.${getFileExtensionFromType(assetData.contentType)}`;
          console.log(":oas")
          setFileInfo({
            blob,
            contentType: assetData.contentType,
            fileName
          });

          return;
        }
      }

      // If not found as a single asset, check if it's a chunked asset
      const chunkedAssetInfo = await storageActor.getChunkedAssetInfo(assetId);

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

            setFileInfo({
              blob,
              contentType: assetInfo.contentType,
              fileName
            });

            return;
          }
        }
      }

      toast.error(`Document not found`);
    } catch (error: any) {
      console.error("Error loading document:", error);
      toast.error(error.message || "Failed to load document");
    } finally {
      setIsLoading(false);
    }
  };

  // Preview the document
  const previewDocument = async () => {
    if (!fileInfo.blob) {
      await loadDocument();
    }

    if (fileInfo.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(reader.result as string);
          setIsPreviewOpen(true);
        }
      };
      reader.readAsDataURL(fileInfo.blob);
    }
  };



  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={previewDocument}
        disabled={isLoading && !fileInfo.blob}
      >
        {isLoading && !fileInfo.blob ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Eye className="h-4 w-4 mr-1" />
        )}
        Preview
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={triggerDownload}
        disabled={isLoading && !fileInfo.blob}
        className="text-blue-500 hover:text-blue-700"
      >
        {isLoading && !fileInfo.blob ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {progress}%
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-1" /> Download
          </>
        )}
      </Button>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Preview: {fileInfo.fileName}</DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <div className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                {fileInfo.contentType?.startsWith('image/') ? (
                  <img src={previewUrl} alt={documentName} className="max-h-96 mx-auto" />
                ) : fileInfo.contentType === 'application/pdf' ? (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">PDF Preview</p>
                      <Button
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={triggerDownload}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">Preview not available for this file type</p>
                      <Button
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={triggerDownload}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}