import { useRef, useState } from 'react'

export default function HolographicCard({
    children,
    className = '',
    style = {},
    glareOpacity = 0.15,
    tiltAmount = 12,
}) {
    const cardRef = useRef(null)
    const [transform, setTransform] = useState('')
    const [glareStyle, setGlareStyle] = useState({})
    const [holoStyle, setHoloStyle] = useState({})
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const percentX = (x - centerX) / centerX
        const percentY = (y - centerY) / centerY

        // 3D tilt
        const rotateX = -percentY * tiltAmount
        const rotateY = percentX * tiltAmount
        setTransform(
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        )

        // Glare position
        const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        setGlareStyle({
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
            opacity: 1,
        })

        // Holographic rainbow gradient
        const angle = glareAngle + 180
        setHoloStyle({
            background: `linear-gradient(${angle}deg, 
        rgba(255,0,0,0.08) 0%, 
        rgba(255,154,0,0.08) 15%, 
        rgba(208,222,33,0.08) 30%, 
        rgba(79,220,74,0.08) 45%, 
        rgba(63,218,216,0.08) 60%, 
        rgba(47,201,226,0.08) 70%, 
        rgba(28,127,238,0.08) 80%, 
        rgba(95,21,242,0.08) 90%, 
        rgba(186,12,248,0.08) 100%)`,
            opacity: 1,
        })
    }

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
        setGlareStyle({ opacity: 0 })
        setHoloStyle({ opacity: 0 })
        setIsHovered(false)
    }

    return (
        <div
            ref={cardRef}
            className={`magnetic group relative overflow-hidden ${className}`}
            style={{
                ...style,
                transform,
                transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">{children}</div>

            {/* Holographic rainbow overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-500"
                style={{ ...holoStyle, mixBlendMode: 'overlay' }}
            />

            {/* Glare/light leak */}
            <div
                className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300"
                style={glareStyle}
            />

            {/* Edge glow on hover */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
                    style={{
                        boxShadow:
                            '0 0 30px rgba(0,245,255,0.08), inset 0 0 30px rgba(0,245,255,0.03)',
                    }}
                />
            )}
        </div>
    )
}
