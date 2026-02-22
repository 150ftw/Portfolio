/**
 * Matrix Rain Easter Egg
 *
 * Triggered via Konami Code: ↑↑↓↓←→←→BA
 * Shows personality and attention to detail. Recruiters remember this.
 *
 * Uses Canvas 2D with optimized column-based rendering.
 */
import { useEffect, useRef, useState, useCallback } from 'react'

const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
]

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\=+*~$@#%&!?'

export default function MatrixRain() {
    const canvasRef = useRef(null)
    const [active, setActive] = useState(false)
    const keysRef = useRef([])
    const animRef = useRef(null)
    const timeoutRef = useRef(null)

    // Listen for Konami Code
    useEffect(() => {
        const handleKey = (e) => {
            keysRef.current.push(e.key)
            // Keep only the last N keys
            if (keysRef.current.length > KONAMI.length) {
                keysRef.current.shift()
            }
            // Check match
            if (keysRef.current.length === KONAMI.length &&
                keysRef.current.every((k, i) => k === KONAMI[i])) {
                setActive(true)
                keysRef.current = []
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    const dismiss = useCallback(() => {
        setActive(false)
        if (animRef.current) cancelAnimationFrame(animRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }, [])

    // Run the rain effect
    useEffect(() => {
        if (!active) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        const fontSize = 14
        const columns = Math.floor(width / fontSize)
        const drops = new Array(columns).fill(0).map(() => Math.random() * -50)
        const speeds = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 1.5)

        let frame = 0
        const draw = () => {
            // Semi-transparent black overlay creates trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
            ctx.fillRect(0, 0, width, height)

            frame++
            for (let i = 0; i < columns; i++) {
                if (frame % 2 === 0 || Math.random() > 0.5) {
                    const char = CHARS[Math.floor(Math.random() * CHARS.length)]
                    const y = drops[i] * fontSize

                    // Lead character — bright white/green
                    ctx.fillStyle = '#00ff41'
                    ctx.font = `${fontSize}px monospace`
                    ctx.fillText(char, i * fontSize, y)

                    // Glow effect on lead char
                    ctx.shadowColor = '#00ff41'
                    ctx.shadowBlur = 10
                    ctx.fillText(char, i * fontSize, y)
                    ctx.shadowBlur = 0

                    // Trailing characters with varying opacity
                    for (let j = 1; j < 5; j++) {
                        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)]
                        const alpha = (1 - j / 5) * 0.3
                        ctx.fillStyle = `rgba(0, 245, 65, ${alpha})`
                        ctx.fillText(trailChar, i * fontSize, y - j * fontSize)
                    }

                    drops[i] += speeds[i]

                    if (drops[i] * fontSize > height && Math.random() > 0.97) {
                        drops[i] = 0
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        // Auto-dismiss after 8 seconds
        timeoutRef.current = setTimeout(dismiss, 8000)

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animRef.current)
            clearTimeout(timeoutRef.current)
            window.removeEventListener('resize', handleResize)
        }
    }, [active, dismiss])

    if (!active) return null

    return (
        <div
            className="fixed inset-0 z-[10000] cursor-pointer"
            onClick={dismiss}
            style={{ background: 'black' }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p
                        className="text-2xl font-bold tracking-widest animate-pulse"
                        style={{ color: '#00ff41', fontFamily: 'monospace', textShadow: '0 0 20px #00ff41' }}
                    >
                        WELCOME TO THE MATRIX
                    </p>
                    <p className="mt-4 text-sm" style={{ color: 'rgba(0, 255, 65, 0.4)' }}>
                        click anywhere to escape
                    </p>
                </div>
            </div>
        </div>
    )
}
