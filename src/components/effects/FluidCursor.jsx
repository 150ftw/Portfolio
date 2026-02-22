import { useEffect, useRef } from 'react'

export default function FluidCursor() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Skip on touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouch) return

        const ctx = canvas.getContext('2d')
        let width, height
        let mouseX = 0, mouseY = 0
        let animId
        let isIdle = true
        let idleTimer = null

        // Reduced particle count for performance
        const particles = []
        const PARTICLE_COUNT = 14
        const MAX_DIST = 120
        const MAX_DIST_SQ = MAX_DIST * MAX_DIST
        const CONNECT_DIST_SQ = 8100 // 90*90

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        const init = () => {
            resize()
            particles.length = 0
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.2 + 0.6,
                    baseAlpha: Math.random() * 0.2 + 0.06,
                    alpha: 0,
                    hue: Math.random() * 40 + 180,
                })
            }
        }

        let frameCount = 0
        const animate = () => {
            frameCount++
            // Skip every other frame when idle to cut GPU work in half
            if (isIdle && frameCount % 2 === 0) {
                animId = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, width, height)

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                const dx = mouseX - p.x
                const dy = mouseY - p.y
                const distSq = dx * dx + dy * dy

                if (distSq < MAX_DIST_SQ) {
                    const dist = Math.sqrt(distSq)
                    const force = (MAX_DIST - dist) / MAX_DIST
                    p.vx += (dx / dist) * force * 0.08
                    p.vy += (dy / dist) * force * 0.08
                    p.alpha = p.baseAlpha + force * 0.25
                } else {
                    p.alpha += (p.baseAlpha - p.alpha) * 0.04
                }

                p.vx *= 0.96
                p.vy *= 0.96
                p.x += p.vx
                p.y += p.vy

                if (p.x < 0) p.x = width
                if (p.x > width) p.x = 0
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`
                ctx.fill()
            }

            // Draw connections — batch into single path for fewer draw calls
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)'
            ctx.lineWidth = 0.4
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distSq = dx * dx + dy * dy
                    if (distSq < CONNECT_DIST_SQ) {
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                    }
                }
            }
            ctx.stroke()

            animId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
            isIdle = false
            clearTimeout(idleTimer)
            idleTimer = setTimeout(() => { isIdle = true }, 500)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('resize', resize, { passive: true })

        init()
        animate()

        return () => {
            cancelAnimationFrame(animId)
            clearTimeout(idleTimer)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[50]"
            style={{ opacity: 0.7 }}
        />
    )
}
