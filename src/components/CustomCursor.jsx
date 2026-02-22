import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const cursorDotRef = useRef(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    useEffect(() => {
        // Detect touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        setIsTouchDevice(isTouch)
        if (isTouch) return

        const cursor = cursorRef.current
        const dot = cursorDotRef.current
        let mouseX = 0, mouseY = 0
        let cursorX = 0, cursorY = 0
        let animId

        const handleMouseMove = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        // Use event delegation instead of MutationObserver + querySelectorAll
        const handleMouseOver = (e) => {
            const el = e.target.closest('a, button, input, textarea, [role="button"], .magnetic')
            if (el) setIsHovering(true)
        }
        const handleMouseOut = (e) => {
            const el = e.target.closest('a, button, input, textarea, [role="button"], .magnetic')
            if (el) setIsHovering(false)
        }

        // Smooth follow animation
        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.12
            cursorY += (mouseY - cursorY) * 0.12

            if (cursor) {
                cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`
            }
            if (dot) {
                dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`
            }

            animId = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        document.addEventListener('mouseenter', handleMouseEnter)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseout', handleMouseOut, { passive: true })

        animId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseenter', handleMouseEnter)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (isTouchDevice) return null

    return (
        <>
            {/* Outer ring */}
            <div
                ref={cursorRef}
                className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full transition-all duration-300"
                style={{
                    width: isHovering ? 48 : 32,
                    height: isHovering ? 48 : 32,
                    border: `1.5px solid ${isHovering ? '#00f5ff' : 'rgba(255,255,255,0.3)'}`,
                    opacity: isVisible ? 1 : 0,
                    background: isHovering ? 'rgba(0, 245, 255, 0.06)' : 'transparent',
                    mixBlendMode: 'difference',
                }}
            />
            {/* Inner dot */}
            <div
                ref={cursorDotRef}
                className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full"
                style={{
                    width: 6,
                    height: 6,
                    background: '#00f5ff',
                    opacity: isVisible ? 1 : 0,
                }}
            />
        </>
    )
}
