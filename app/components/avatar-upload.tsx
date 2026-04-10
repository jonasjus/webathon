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
      className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-left transition hover:border-[var(--sage-500)] hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
    >
      <div className="relative">
        <Avatar src={preview} initials={initials} color={color} size={72} />
        <span className="pointer-events-none absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--sage-500)] text-white shadow-sm">
          {uploading ? (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--ink)]">
          Profilbilde
        </p>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {uploading
            ? "Laster opp nytt bilde..."
            : "Trykk her for å laste opp eller bytte profilbilde."}
        </p>
        <p className="mt-2 text-xs text-[var(--ink-subtle)]">
          PNG, JPG eller WEBP
        </p>
      </div>

      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--sage-500)] px-4 text-sm font-semibold text-[var(--sage-700)] transition group-hover:bg-[var(--surface)]">
        {uploading ? "Laster opp..." : preview ? "Bytt bilde" : "Last opp bilde"}
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
