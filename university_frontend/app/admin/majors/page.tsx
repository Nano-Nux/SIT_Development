'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminMajorsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/departments');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0400CC]">
        <GraduationCap className="w-8 h-8" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-extrabold text-[#00001C]">Merged into Departments & Majors</h2>
        <p className="text-sm text-slate-500">
          Featured Majors and Academic Departments have been unified into a single manager for simpler administration.
        </p>
      </div>
      <Link
        href="/admin/departments"
        className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
      >
        <span>Go to Departments & Majors</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
