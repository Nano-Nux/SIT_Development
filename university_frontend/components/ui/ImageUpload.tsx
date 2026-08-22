'use client';

import React, { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Upload, X, Check, Image as ImageIcon, Loader2, Link2, Copy, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helpText?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  className?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Upload image to SeaweedFS...',
  helpText,
  aspectRatio = 'auto',
  className = '',
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'wide':
        return 'aspect-[21/9]';
      default:
        return 'max-h-48 min-h-32';
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Reset error
    setError(null);
    setIsUploading(true);

    try {
      // Upload raw file to SeaweedFS via backend with 100% original quality
      const res = await api.uploadFile(file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        throw new Error('No URL returned from file server');
      }
    } catch (err: any) {
      console.error('SeaweedFS upload error:', err);
      setError(err.message || 'Upload to SeaweedFS failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // reset input value so re-uploading same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] font-semibold text-[#0400CC] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            {showManualUrl ? 'Hide Direct URL' : 'Edit URL directly'}
          </button>
        </div>
      )}

      {/* Upload Zone & Preview */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
        />

        {value ? (
          /* Preview state */
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 transition-all hover:border-[#0400CC]/40">
            <div className={`w-full ${getAspectClass()} relative bg-slate-900/5 flex items-center justify-center overflow-hidden`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.classList.add('opacity-40');
                }}
              />

              {/* Overlay with Action Buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-white text-[#00001C] rounded-xl text-xs font-bold shadow hover:bg-blue-50 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                >
                  <Upload className="w-3.5 h-3.5 text-[#0400CC]" />
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-white/90 text-slate-700 rounded-xl text-xs font-bold shadow hover:bg-white flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>

            {/* SeaweedFS URL bar */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-500 truncate max-w-[280px] sm:max-w-xs">{value}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shrink-0 ml-2">
                SeaweedFS Stored
              </span>
            </div>
          </div>
        ) : (
          /* Empty / Upload dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-[#0400CC] bg-blue-50/50 scale-[0.99]'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 hover:border-[#0400CC]/50'
            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-[#0400CC] animate-spin" />
                <p className="text-xs font-bold text-[#00001C]">Uploading to SeaweedFS (Full Quality)...</p>
                <p className="text-[11px] text-slate-400">Preserving original resolution without loss</p>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00001C]">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WebP, SVG up to 50MB (Raw Original Quality)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual URL input drawer */}
      {showManualUrl && (
        <div className="pt-2 animate-in fade-in duration-200">
          <div className="relative">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'https://... or /images/...'}
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
            />
            <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}
    </div>
  );
};
