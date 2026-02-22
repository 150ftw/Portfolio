import { useEffect, useRef } from 'react'

export default function ParticleTrail() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouch) return

        const ctx = canvas.getContext('2d')
        let width, height
        let mouseX = 0, mouseY = 0
        let prevMouseX = 0, prevMouseY = 0
        // Use typed arrays for particle pool (fixed size, no GC)
        const MAX_PARTICLES = 60
        const px = new Float32Array(MAX_PARTICLES)
        const py = new Float32Array(MAX_PARTICLES)
        const pvx = new Float32Array(MAX_PARTICLES)
        const pvy = new Float32Array(MAX_PARTICLES)
        const palpha = new Float32Array(MAX_PARTICLES)
        const pradius = new Float32Array(MAX_PARTICLES)
        const pdecay = new Float32Array(MAX_PARTICLES)
        const phue = new Float32Array(MAX_PARTICLES)
        let particleCount = 0
        let animId
        let hue = 185
        let isActive = false
        let idleTimer = null

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        const handleMouseMove = (e) => {
            prevMouseX = mouseX
            prevMouseY = mouseY
            mouseX = e.clientX
            mouseY = e.clientY

            const dx = mouseX - prevMouseX
            const dy = mouseY - prevMouseY
            const speed = Math.sqrt(dx * dx + dy * dy)

            const count = Math.min(Math.floor(speed * 0.15), 2)
            for (let i = 0; i < count; i++) {
                if (particleCount >= MAX_PARTICLES) break
                const idx = particleCount++
                const t = i / (count || 1)
                px[idx] = prevMouseX + dx * t
                py[idx] = prevMouseY + dy * t
                pvx[idx] = (Math.random() - 0.5) * 1.2
                pvy[idx] = (Math.random() - 0.5) * 1.2 - 0.6
                palpha[idx] = 1
                pradius[idx] = Math.random() * 1.8 + 0.4
                pdecay[idx] = Math.random() * 0.025 + 0.012
                phue[idx] = hue + Math.random() * 20 - 10
            }

            hue = (hue + speed * 0.04) % 360
            if (hue > 320 || hue < 170) hue = 185

            // Mark as active; start loop if needed
            isActive = true
            clearTimeout(idleTimer)
            idleTimer = setTimeout(() => { isActive = false }, 300)
        }

        const animate = () => {
            // If idle and no particles left, skip rendering entirely
            if (!isActive && particleCount === 0) {
                animId = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, width, height)

            let writeIdx = 0
            for (let i = 0; i < particleCount; i++) {
                pvy[i] += 0.015
                pvx[i] *= 0.98
                pvy[i] *= 0.98
                px[i] += pvx[i]
                py[i] += pvy[i]
                palpha[i] -= pdecay[i]
                pradius[i] *= 0.997

                if (palpha[i] > 0.01) {
                    if (writeIdx !== i) {
                        px[writeIdx] = px[i]
                        py[writeIdx] = py[i]
                        pvx[writeIdx] = pvx[i]
                        pvy[writeIdx] = pvy[i]
                        palpha[writeIdx] = palpha[i]
                        pradius[writeIdx] = pradius[i]
                        pdecay[writeIdx] = pdecay[i]
                        phue[writeIdx] = phue[i]
                    }
                    ctx.globalAlpha = palpha[writeIdx]
                    ctx.beginPath()
                    ctx.arc(px[writeIdx], py[writeIdx], pradius[writeIdx], 0, Math.PI * 2)
                    ctx.fillStyle = `hsla(${phue[writeIdx]}, 100%, 70%, 1)`
                    ctx.fill()
                    writeIdx++
                }
            }
            ctx.globalAlpha = 1
            particleCount = writeIdx

            animId = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('resize', resize, { passive: true })
        resize()
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
            className="pointer-events-none fixed inset-0 z-[51]"
        />
    )
}
