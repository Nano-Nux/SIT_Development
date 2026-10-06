'use client';

import { useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Plus, Upload, X } from 'lucide-react';
import { api } from '@/lib/api';

interface MultiImageUploadProps {
  label: string;
  value: string[];
  onChange: (images: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  disabled?: boolean;
}

export function MultiImageUpload({
  label,
  value,
  onChange,
  onUploadingChange,
  disabled = false,
}: MultiImageUploadProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const busy = uploading || disabled;

  const upload = async (files: File[]) => {
    if (!files.length || busy) return;
    setError('');
    setUploading(true);
    onUploadingChange(true);
    const uploaded: string[] = [];
    const errors: string[] = [];
    try {
      // Upload in selection order, preserving successful files if another upload fails.
      for (const [i, file] of files.entries()) {
        setProgress(`${i + 1} / ${files.length}`);
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Please choose an image.`);
          continue;
        }
        if (file.size > 50 * 1024 * 1024) {
          errors.push(`${file.name}: Images must be 50 MB or smaller.`);
          continue;
        }
        try {
          const result = await api.uploadFile(file);
          if (!result.url) throw new Error('No image URL returned.');
          uploaded.push(result.url);
        } catch (cause) {
          errors.push(
            `${file.name}: ${cause instanceof Error ? cause.message : 'Upload failed. Please try again.'}`,
          );
        }
      }
      if (uploaded.length) onChange([...new Set([...value, ...uploaded])]);
      setError(errors.join('\n'));
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  const move = (index: number, direction: number) => {
    const images = [...value];
    [images[index], images[index + direction]] = [
      images[index + direction],
      images[index],
    ];
    onChange(images);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
      >
        {label}
      </label>
      <p className="text-xs text-slate-500">
        Select multiple images at once. The first image is the cover. Use the
        arrows to change their order.
      </p>
      <input
        id={id}
        ref={input}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        className="hidden"
        onChange={(event) => {
          void upload(Array.from(event.currentTarget.files ?? []));
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
          void upload(Array.from(event.dataTransfer.files));
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
            ? `Uploading images ${progress}...`
            : 'Choose images or drag and drop'}
        </span>
        <span className="block mt-1 text-xs text-slate-500">
          Images up to 50 MB each
        </span>
      </button>
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="aspect-video w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="text-[11px] font-bold text-slate-600">
                  {index === 0 ? 'Cover' : `${index + 1}`}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} left`}
                    disabled={busy || index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move image ${index + 1} right`}
                    disabled={busy || index === value.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                    disabled={busy}
                    onClick={() =>
                      onChange(value.filter((_, i) => i !== index))
                    }
                    className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          aria-label="Image URL"
          placeholder="Or paste an image URL"
          value={url}
          disabled={busy}
          onChange={(event) => setUrl(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
        />
        <button
          type="button"
          disabled={busy || !url.trim()}
          onClick={() => {
            onChange([...new Set([...value, url.trim()])]);
            setUrl('');
          }}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#0400CC] disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="whitespace-pre-line rounded-xl bg-red-50 p-3 text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
