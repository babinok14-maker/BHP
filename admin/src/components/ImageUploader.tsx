import { useRef, useState } from "react";
import * as membersApi from "../api/members";
import { Member } from "../types";

interface Props {
  memberId: string;
  currentPhotoUrl: string | null;
  onUploaded: (member: Member) => void;
}

export default function ImageUploader({ memberId, currentPhotoUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setError(null);

    try {
      const updated = await membersApi.uploadMemberPhoto(memberId, file);
      onUploaded(updated);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <img
        src={preview || "https://placehold.co/80x80?text=No+Photo"}
        alt="Member preview"
        className="h-20 w-20 rounded-full border-2 border-approved object-cover"
      />
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : "Upload photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
