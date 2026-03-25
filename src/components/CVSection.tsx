import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Instagram, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel';
import { ImageWithFallback } from './figma/ImageWithFallback';

// 각 전시 이미지 슬라이드 목록
const pcoImages = [
  { src: '/exhibitions/pco/overview.webp',      fullSrc: '/exhibitions/pco/full/overview.jpg',      alt: 'PCO 서울 - 너머에 전경' },
  { src: '/exhibitions/pco/interior3.webp',     fullSrc: '/exhibitions/pco/full/interior3.jpg',     alt: 'PCO 서울 - 너머에 내부 3' },
  { src: '/exhibitions/pco/interior-wall.webp', fullSrc: '/exhibitions/pco/full/interior-wall.jpg', alt: 'PCO 서울 - 너머에 내부벽' },
  { src: '/exhibitions/pco/preface.webp',       fullSrc: '/exhibitions/pco/full/preface.jpg',       alt: 'PCO 서울 - 너머에 서문' },
  { src: '/exhibitions/pco/right-wall1.webp',   fullSrc: '/exhibitions/pco/full/right-wall1.jpg',   alt: 'PCO 서울 - 너머에 오른쪽벽 1' },
  { src: '/exhibitions/pco/right-wall2.webp',   fullSrc: '/exhibitions/pco/full/right-wall2.jpg',   alt: 'PCO 서울 - 너머에 오른쪽벽 2' },
  { src: '/exhibitions/pco/left-wall8.webp',    fullSrc: '/exhibitions/pco/full/left-wall8.jpg',    alt: 'PCO 서울 - 너머에 왼쪽벽 8' },
];

const powerplantImages = [
  { src: '/exhibitions/powerplant/dialogue04_1.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_1.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 1' },
  { src: '/exhibitions/powerplant/dialogue04_2.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_2.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 2' },
  { src: '/exhibitions/powerplant/dialogue04_4.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_4.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 4' },
  { src: '/exhibitions/powerplant/dialogue04_5.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_5.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 5' },
  { src: '/exhibitions/powerplant/dialogue04_6.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_6.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 6' },
  { src: '/exhibitions/powerplant/dialogue04_8.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_8.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 8' },
  { src: '/exhibitions/powerplant/dialogue04_9.webp',  fullSrc: '/exhibitions/powerplant/dialogue04_9.jpg',  alt: '서울대 파워플랜트 - 다이얼로그 04 9' },
  { src: '/exhibitions/powerplant/dialogue04_12.webp', fullSrc: '/exhibitions/powerplant/dialogue04_12.jpg', alt: '서울대 파워플랜트 - 다이얼로그 04 12' },
  { src: '/exhibitions/powerplant/dialogue04_14.webp', fullSrc: '/exhibitions/powerplant/dialogue04_14.jpg', alt: '서울대 파워플랜트 - 다이얼로그 04 14' },
  { src: '/exhibitions/powerplant/dialogue04_16.webp', fullSrc: '/exhibitions/powerplant/dialogue04_16.jpg', alt: '서울대 파워플랜트 - 다이얼로그 04 16' },
];

type ImageItem = { src: string; fullSrc?: string; alt: string };

function Lightbox({
  images,
  index,
  onClose,
}: {
  images: ImageItem[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const [loaded, setLoaded] = useState(false);

  const prev = useCallback(() => { setCurrent((c) => (c - 1 + images.length) % images.length); setLoaded(false); }, [images.length]);
  const next = useCallback(() => { setCurrent((c) => (c + 1) % images.length); setLoaded(false); }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  const isMobile = window.innerWidth < 768;
  const arrowSize = isMobile ? 24 : 36;

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: 0.7 }} />

      {/* 닫기 버튼 */}
      <button
        style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 1, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={onClose}
      >
        <X size={isMobile ? 20 : 28} />
      </button>

      {/* 이전 화살표 */}
      <button
        style={{ position: 'absolute', left: isMobile ? '0.25rem' : '0.75rem', zIndex: 1, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={arrowSize} />
      </button>

      {/* 이미지 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: isMobile ? '90vw' : '80vw',
          maxHeight: '90vh',
          padding: isMobile ? '0 2rem' : '0 4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로딩 중엔 WebP 썸네일 표시 */}
        {!loaded && (
          <img
            src={images[current].src}
            alt={images[current].alt}
            style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', display: 'block', filter: 'blur(2px)' }}
          />
        )}
        {/* 고화질 JPG — 로드 완료되면 교체 */}
        <img
          key={images[current].fullSrc ?? images[current].src}
          src={images[current].fullSrc ?? images[current].src}
          alt={images[current].alt}
          style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', display: loaded ? 'block' : 'none', position: loaded ? 'static' : 'absolute' }}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget;
            if (images[current].fullSrc && target.src.includes('/full/')) {
              target.src = images[current].src;
            }
            setLoaded(true);
          }}
        />
      </div>

      {/* 다음 화살표 */}
      <button
        style={{ position: 'absolute', right: isMobile ? '0.25rem' : '0.75rem', zIndex: 1, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={arrowSize} />
      </button>
    </div>,
    document.body
  );
}

export function CVSection() {
  const [lightbox, setLightbox] = useState<{ images: ImageItem[]; index: number } | null>(null);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="space-y-12">
        {/* Exhibition */}
        <section>
          <h3 className="mb-6 pb-2 border-b border-gray-200">Exhibition</h3>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <p className="opacity-50">2026</p>
            <div className="mb-8">
              <p className="mb-1">
                쿠로다 {' '}
                <a 
                  href="https://www.instagram.com/p/DTpcPPTkRyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-60 transition-opacity"
                >
                  《너머에》
                </a>
              </p>
              <p className="opacity-50 mb-4">PCO 서울</p>
              <Carousel className="w-full">
                <CarouselContent>
                  {pcoImages.map((img, i) => (
                    <CarouselItem key={i}>
                      <div style={{ width: '100%', height: '120px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={img.src}
                          alt={img.alt}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                          onClick={() => setLightbox({ images: pcoImages, index: i })}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <p className="opacity-50">2025</p>
            <div>
              <p className="mb-1">
                푸하하하 x 쿠로다{' '}
                <a 
                  href="https://culture.snu.ac.kr/event/dialogue04/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-60 transition-opacity"
                >
                  《다이얼로그 04: 그들에게는 보이지 않아》
                </a>
              </p>
              <p className="opacity-50 mb-4">서울대학교 파워플랜트</p>
              <Carousel className="w-full">
                <CarouselContent>
                  {powerplantImages.map((img, i) => (
                    <CarouselItem key={i}>
                      <div style={{ width: '100%', height: '120px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={img.src}
                          alt={img.alt}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                          onClick={() => setLightbox({ images: powerplantImages, index: i })}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Instagram */}
        <section>
          <h3 className="mb-6 pb-2 border-b border-gray-200">Instagram</h3>
          <div className="space-y-4">
            <a 
              href="https://www.instagram.com/kuroda.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-60 transition-opacity"
            >
              <Instagram size={20} className="opacity-70" />
              <span>Kuroda.official</span>
            </a>
            <a 
              href="https://www.instagram.com/rim___pa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-60 transition-opacity"
            >
              <Instagram size={20} className="opacity-70" />
              <span>Rim Park</span>
            </a>
            <a 
              href="https://www.instagram.com/fayexna/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-60 transition-opacity"
            >
              <Instagram size={20} className="opacity-70" />
              <span>Yuna Lee (Juda)</span>
            </a>
            <a 
              href="https://www.instagram.com/yoonanplz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-60 transition-opacity"
            >
              <Instagram size={20} className="opacity-70" />
              <span>Yoonan</span>
            </a>
          </div>
        </section>
      </div>
    </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
