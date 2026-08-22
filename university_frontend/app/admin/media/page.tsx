'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Image as ImageIcon, Upload, Copy, Check, Sparkles, Database, ExternalLink, HardDrive } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminMediaPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);
  const [dbMedia, setDbMedia] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Common extracted assets
  const commonAssets = [
    { name: 'Home Hero Banner', path: '/images/home_desktopview/img_1.jpg' },
    { name: 'Student Hackathon', path: '/images/home_desktopview/img_2.jpg' },
    { name: 'Business Lab', path: '/images/home_desktopview/img_3.jpg' },
    { name: 'Media Production Studio', path: '/images/home_desktopview/img_4.jpg' },
    { name: 'Faculty Dr. Sarah', path: '/images/home_desktopview/img_5.jpg' },
    { name: 'Faculty Prof. David', path: '/images/home_desktopview/img_6.jpg' },
    { name: 'Founder Oknha Dr. Mengly', path: '/images/about_desktopview/img_1.jpg' },
    { name: 'Campus Robotics Lab', path: '/images/life_at_sit_desktopview/img_1.jpg' },
    { name: 'Startup Incubator', path: '/images/life_at_sit_desktopview/img_2.jpg' },
    { name: 'Central Digital Library', path: '/images/life_at_sit_desktopview/img_3.jpg' },
    { name: 'Olympic Sports Arena', path: '/images/life_at_sit_desktopview/img_4.jpg' },
    { name: 'IT Department Banner', path: '/images/department_it_desktopview/img_1.jpg' },
  ];

  useEffect(() => {
    loadDatabaseMedia();
  }, []);

  const loadDatabaseMedia = async () => {
    setLoadingMedia(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sit_admin_token') : null;
      const res = await fetch('http://localhost:5000/api/uploads', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setDbMedia(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load database media list:', e);
    } finally {
      setLoadingMedia(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUploadSuccess = (url: string) => {
    setUploadedUrl(url);
    loadDatabaseMedia();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
          <ImageIcon className="w-7 h-7 text-[#0400CC]" />
          SeaweedFS Media & Asset Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload lossless high-resolution images to the SeaweedFS distributed file server. All URLs returned are stored directly in PostgreSQL.
        </p>
      </div>

      {/* SeaweedFS Direct Uploader */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#00001C] flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#0400CC]" />
            Upload New Full-Quality Asset
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            SeaweedFS Engine Active
          </span>
        </div>

        <ImageUpload
          label="Select or Drag High-Res Asset"
          value={uploadedUrl}
          onChange={handleUploadSuccess}
          placeholder="Upload to SeaweedFS..."
          helpText="Images are transferred uncompressed directly into the SeaweedFS cluster bucket."
          aspectRatio="video"
        />

        {uploadedUrl && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
            <div className="text-xs text-emerald-800 space-y-0.5">
              <span className="font-bold block">Uploaded to SeaweedFS & Registered:</span>
              <span className="font-mono text-[11px] block break-all">{uploadedUrl}</span>
            </div>
            <button
              onClick={() => copyToClipboard(uploadedUrl)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow shrink-0 cursor-pointer"
            >
              {copied === uploadedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === uploadedUrl ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        )}
      </div>

      {/* Database / SeaweedFS Uploaded Assets */}
      {dbMedia.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0400CC]" />
              Uploaded SeaweedFS Storage Assets ({dbMedia.length})
            </h2>
            <button
              onClick={loadDatabaseMedia}
              className="text-xs font-bold text-[#0400CC] hover:underline cursor-pointer"
            >
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dbMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.classList.add('opacity-40');
                      }}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-[#00001C] line-clamp-1">{item.fileName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'SeaweedFS'}
                  </p>
                </div>

                <div className="mt-3 flex gap-1.5">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0400CC] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied === item.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copied === item.url ? 'Copied' : 'Copy URL'}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0400CC] flex items-center justify-center"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Repository Showcase */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#00001C]">
          Extracted Figma Assets Directory
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {commonAssets.map((asset, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.path}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-bold text-[#00001C] line-clamp-1">{asset.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 truncate">{asset.path}</p>
              </div>

              <button
                onClick={() => copyToClipboard(asset.path)}
                className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0400CC] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                {copied === asset.path ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied === asset.path ? 'Copied' : 'Copy Path'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
