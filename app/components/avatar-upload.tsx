"use client";

import { useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { updateAvatarUrl } from "../lib/avatar-actions";
import { Avatar } from "./avatar";

interface AvatarUploadProps {
  userId: string;
  currentSrc?: string | null;
  initials: string;
  color: string;
}

export function AvatarUpload({ userId, currentSrc, initials, color }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentSrc ?? null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Add cache-busting so the browser fetches the new image
      const url = `${data.publicUrl}?t=${Date.now()}`;

      setPreview(url);
      await updateAvatarUrl(url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <button
      type="button"
      title="Endre profilbilde"
      disabled={uploading}
      onClick={() => inputRef.current?.click()}
      className="group relative flex-shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
    >
      <Avatar src={preview} initials={initials} color={color} size={44} />

      {/* Hover overlay */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-100">
        {uploading ? (
          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </button>
  );
}
