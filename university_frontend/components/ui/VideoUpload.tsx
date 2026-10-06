'use client';

import { useId, useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { api } from '@/lib/api';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  disabled?: boolean;
}

export function VideoUpload({
  value,
  onChange,
  onUploadingChange,
  disabled = false,
}: VideoUploadProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const busy = uploading || disabled;

  const upload = async (file?: File) => {
    if (!file || busy) return;
    setError('');
    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      setError('Please choose an MP4 or WebM video.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(
        'Videos must be 50 MB or smaller. You can also paste a hosted video URL.',
      );
      return;
    }
    setUploading(true);
    onUploadingChange(true);
    try {
      const result = await api.uploadFile(file);
      if (!result.url) throw new Error('No video URL returned.');
      onChange(result.url);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Video upload failed. Please try again.',
      );
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
      >
        Homepage Hero Video
      </label>
      <input
        id={id}
        ref={input}
        type="file"
        accept="video/mp4,video/webm,.mp4,.webm"
        disabled={busy}
        className="hidden"
        onChange={(event) => {
          void upload(event.currentTarget.files?.[0]);
          event.currentTarget.value = '';
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void upload(event.dataTransfer.files[0]);
        }}
        className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center hover:border-[#0400CC] disabled:opacity-60 cursor-pointer disabled:cursor-wait"
      >
        {uploading ? (
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0400CC]" />
        ) : (
          <Upload className="mx-auto mb-2 h-6 w-6 text-[#0400CC]" />
        )}
        <span className="block text-sm font-bold text-slate-800">
          {uploading
            ? 'Uploading video...'
            : value
              ? 'Replace hero video'
              : 'Choose a video or drag and drop'}
        </span>
        <span className="block mt-1 text-xs text-slate-500">
          MP4 or WebM, up to 50 MB
        </span>
      </button>
      <div className="flex items-center gap-2">
        <input
          type="text"
          aria-label="Hero video URL"
          value={value}
          disabled={busy}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste a direct .mp4 or .webm URL"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
        />
        {value && (
          <button
            type="button"
            aria-label="Remove hero video"
            disabled={busy}
            onClick={() => onChange('')}
            className="rounded-xl bg-red-50 p-2 text-red-600 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500">
        The video plays automatically, muted, and loops on the homepage. Use a
        direct video file URL for hosted videos.
      </p>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
