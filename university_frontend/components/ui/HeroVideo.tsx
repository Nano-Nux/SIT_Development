'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeroVideoProps {
  src?: string;
  className?: string;
}

const FALLBACK_IMAGE = '/images/home_desktopview/img_1.jpg';

export function HeroVideo({
  src,
  className = '',
}: HeroVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [firstFrame, setFirstFrame] = useState<string>();
  const { lang } = useLanguage();
  const isLa = lang === 'LA';

  return (
    <div className={`relative overflow-hidden bg-[#00001C] ${className}`}>
      {src && !failed ? (
        <video
          ref={video}
          src={src}
          poster={firstFrame}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={isLa ? 'ວິດີໂອແນະນຳ SIT' : 'SIT University campus video'}
          className="absolute inset-0 h-full w-full object-cover"
          onLoadedData={(event) => {
            const element = event.currentTarget;
            if (!element.videoWidth || !element.videoHeight) return;

            const canvas = document.createElement('canvas');
            canvas.width = element.videoWidth;
            canvas.height = element.videoHeight;
            const context = canvas.getContext('2d');
            if (!context) return;

            context.drawImage(element, 0, 0, canvas.width, canvas.height);
            try {
              setFirstFrame(canvas.toDataURL('image/jpeg', 0.85));
            } catch {
              // Cross-origin video URLs may not allow canvas export. The video
              // element still displays its own first frame when it is ready.
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        >
          {isLa
            ? 'ບຣາວເຊີຂອງທ່ານບໍ່ຮອງຮັບວິດີໂອ.'
            : 'Your browser does not support video playback.'}
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={firstFrame || FALLBACK_IMAGE}
          alt={isLa ? 'ມະຫາວິທະຍາໄລ SIT' : 'SIT University campus'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {src && !failed && (
        <button
          type="button"
          aria-label={
            playing
              ? isLa
                ? 'ຢຸດວິດີໂອຊົ່ວຄາວ'
                : 'Pause video'
              : isLa
                ? 'ຫຼິ້ນວິດີໂອ'
                : 'Play video'
          }
          onClick={() => {
            if (!video.current) return;
            if (video.current.paused)
              void video.current.play().catch(() => setPlaying(false));
            else video.current.pause();
          }}
          className="absolute bottom-4 right-4 rounded-full bg-black/60 p-3 text-white shadow hover:bg-black/80 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          {playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
