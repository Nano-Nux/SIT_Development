'use client';

import React, { useState, useRef } from 'react';
import { api } from '@/lib/api';
import {
  Upload,
  X,
  FileText,
  Loader2,
  Link2,
  ExternalLink,
  AlertCircle,
  FileCheck,
  Download,
} from 'lucide-react';

interface FileUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string, fileMeta?: { fileType: string; fileSize: string; originalName: string }) => void;
  placeholder?: string;
  helpText?: string;
  accept?: string;
  className?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Upload PDF, DOCX, or document to SeaweedFS...',
  helpText = 'Supports PDF, Word, Excel, ZIP up to 50MB. Uploads directly to SeaweedFS.',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt',
  className = '',
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getExtensionType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toUpperCase() || 'PDF';
    return ext;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Upload raw file to SeaweedFS via backend
      const res = await api.uploadFile(file);
      if (res && res.url) {
        const fileType = getExtensionType(file.name);
        const fileSize = formatFileSize(file.size);
        onChange(res.url, {
          fileType,
          fileSize,
          originalName: file.name,
        });
      } else {
        throw new Error('No URL returned from upload server');
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

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  };

  const fileName = value ? value.split('/').pop() : '';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Header */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-xs text-[#0400CC] hover:underline font-semibold inline-flex items-center gap-1"
          >
            <Link2 className="w-3 h-3" />
            {showManualUrl ? 'Upload via File' : 'Paste Direct URL'}
          </button>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        id={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
      />

      {showManualUrl ? (
        /* Manual URL Input */
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Paste a direct URL from SeaweedFS or any storage service.
          </p>
        </div>
      ) : value ? (
        /* File Uploaded Preview Card */
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0400CC] flex items-center justify-center shrink-0 border border-blue-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                  {fileName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                  SeaweedFS Ready
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-sm">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#0400CC] transition-colors border border-slate-200 inline-flex items-center gap-1 text-xs font-semibold"
              title="Test Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0400CC] transition-colors border border-blue-200 inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Replace File"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replace</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200 cursor-pointer"
              title="Remove File"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            dragOver
              ? 'border-[#0400CC] bg-blue-50/50'
              : 'border-slate-300 hover:border-[#0400CC] hover:bg-slate-50/60 bg-white'
          } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#0400CC] animate-spin" />
              <p className="text-xs font-bold text-[#00001C]">Uploading Document to SeaweedFS...</p>
              <p className="text-[11px] text-slate-400">Please wait while the file is securely stored</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Click or drag document to upload to SeaweedFS
                </p>
                <p className="text-xs text-slate-400 mt-1">{helpText}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
