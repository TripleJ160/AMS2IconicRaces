export function NoiseTexture() {
  return (
    <>
      {/* Film grain noise overlay */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.0,
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Subtle vignette for corner darkening */}
      <div 
        className="fixed inset-0 z-[99] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </>
  )
}
