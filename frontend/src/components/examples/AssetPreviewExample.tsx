import { useAssetPreview } from "@/hooks/useAssetPreview";
import { cn } from "@/lib/utils";

// Single asset example
export function SingleAssetPreview({ assetId, className, previewUrlState }: { assetId: string, className?: string, previewUrlState?: string }) {
  const { previewUrl, isLoading, progress } = useAssetPreview(assetId);
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm font-medium">{progress}%</p>
        </div>
      )}

      <img
        src={previewUrl || previewUrlState}
        alt="Asset preview"
        className={cn("w-full h-auto rounded-md", className)}
      />
    </div>
  );
}

// Multiple asset example (fallback chain)
export function MultiAssetPreview({ assetIds }: { assetIds: string[] }) {
  const { previewUrl, isLoading, progress } = useAssetPreview(assetIds);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm font-medium">{progress}%</p>
        </div>
      )}
      <img
        src={previewUrl || "/placeholder.svg"}
        alt="Asset preview"
        className="w-full h-auto rounded-md"
      />
    </div>
  );
}

// Example with custom document name
export function AssetPreviewWithCustomName({ assetId, documentName }: { assetId: string, documentName: string }) {
  const { previewUrl, isLoading, fileInfo } = useAssetPreview(assetId, documentName);

  const handleDownload = () => {
    if (!fileInfo.blob) return;

    const url = URL.createObjectURL(fileInfo.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.fileName || documentName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Asset preview"
          className="w-full h-auto rounded-md"
        />
      </div>

      {fileInfo.blob && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          Download {fileInfo.fileName}
        </button>
      )}
    </div>
  );
}

// Usage example
export default function AssetPreviewExamples() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Single Asset Preview</h2>
        <SingleAssetPreview assetId="example-asset-id-1" />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Multi Asset Preview (with fallbacks)</h2>
        <MultiAssetPreview assetIds={["primary-asset-id", "fallback-asset-id-1", "fallback-asset-id-2"]} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Asset Preview with Custom Document Name</h2>
        <AssetPreviewWithCustomName assetId="example-asset-id-3" documentName="Company Logo.png" />
      </div>
    </div>
  );
}