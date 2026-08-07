import { useEffect, useState } from "react";
import * as membersApi from "../api/members";

interface PdfFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
}

interface Props {
  memberId: string;
}

export default function PdfUploader({ memberId }: Props) {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (memberId) loadPdfs();
  }, [memberId]);

  async function loadPdfs() {
    if (!memberId) return;
    try {
      setIsLoading(true);
      const data = await membersApi.getMemberPdfs(memberId);
      setPdfs(data);
    } catch (err) {
      console.error('Failed to load PDFs:', err);
      setError("Failed to load PDF files");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await membersApi.uploadMemberPdf(memberId, file);
      await loadPdfs();
    } catch (err: any) {
      console.error('PDF upload failed:', err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(pdfId: string) {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await membersApi.deleteMemberPdf(pdfId);
      await loadPdfs();
    } catch {
      setError("Failed to delete PDF");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">PDF Documents</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
          {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading PDFs...</p>
      ) : pdfs.length === 0 ? (
        <p className="text-sm text-gray-500">No PDF files uploaded</p>
      ) : (
        <ul className="space-y-2">
          {pdfs.map((pdf) => (
            <li
              key={pdf.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg
                  className="h-5 w-5 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{pdf.fileName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(pdf.fileSize)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(pdf.id)}
                className="ml-2 text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
