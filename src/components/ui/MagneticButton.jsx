import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function MagneticButton({
    children,
    className = '',
    style = {},
    strength = 0.35,
    radius = 200,
    as: Tag = 'button',
    onClick,
    href,
    ...rest
}) {
    const ref = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
    const x = useSpring(0, springConfig)
    const y = useSpring(0, springConfig)

    const handleMouseMove = (e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)

        if (dist < radius) {
            x.set(distX * strength)
            y.set(distY * strength)
            setIsHovered(true)
        } else {
            x.set(0)
            y.set(0)
            setIsHovered(false)
        }
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    const MotionTag = motion.create(Tag === 'a' ? 'a' : 'button')

    return (
        <MotionTag
            ref={ref}
            className={`magnetic ${className}`}
            style={{
                ...style,
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                willChange: 'transform',
                x,
                y,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            href={href}
            {...rest}
        >
            {/* Inner content with amplified movement */}
            <motion.span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    x: isHovered ? x : 0,
                    y: isHovered ? y : 0,
                }}
            >
                {children}
            </motion.span>
        </MotionTag>
    )
}
