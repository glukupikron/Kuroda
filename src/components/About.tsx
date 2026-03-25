import { useRef, useCallback } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updateOverlay = useCallback((x: number, y: number) => {
    if (!overlayRef.current) return;
    overlayRef.current.style.background = `radial-gradient(circle 160px at ${x}px ${y}px, transparent 0%, white 80%)`;
  }, []);

  const clearOverlay = useCallback(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.background = 'white';
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    updateOverlay(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = e.touches[0];
    updateOverlay(t.clientX - rect.left, t.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={clearOverlay}
      onTouchMove={handleTouchMove}
      onTouchEnd={clearOverlay}
    >
      {/* 숨겨진 배경 이미지 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '-88px',
        backgroundImage: "url('/homehidden.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />

      {/* 흰색 오버레이 — 커서 위치에 구멍이 뚫려 배경이 드러남 */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '-88px',
          background: 'white',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 기존 콘텐츠 */}
      <div style={{ position: 'relative', zIndex: 2 }} className="flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-full max-w-md mb-8">
          <ImageWithFallback
            src="https://culture.snu.ac.kr/wp-content/uploads/2025/10/kuroda_profile.png"
            alt="kuroda profile"
            className="w-full h-auto"
          />
        </div>
        <div className="text-center space-y-4">
          <h2 className="tracking-tight">About Kuroda</h2>
          <p className="opacity-80 leading-relaxed">
            쿠로다(黒田/검은 밭)는 2023년 결성된 만화 동인이다. <br />만화를 사랑하고 즐기는 세 친구 림파/유나/유난이 만나 <br />만화 이야기를 하고, 모임을 열고, 직접 만화책을 펴낸다.
          </p>
          <p className="opacity-75">
            kurodamanga@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
