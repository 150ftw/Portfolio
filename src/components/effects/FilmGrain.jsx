export default function FilmGrain() {
    return (
        <>
            {/* Static noise grain — use CSS background instead of animated SVG filter */}
            <div
                className="pointer-events-none fixed inset-0 z-[9998]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    opacity: 0.025,
                    mixBlendMode: 'overlay',
                    /* Remove continuous animation — static grain is far cheaper */
                }}
            />

            {/* Vignette overlay — pure CSS, very cheap */}
            <div
                className="pointer-events-none fixed inset-0 z-[9997]"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)',
                }}
            />
        </>
    )
}
