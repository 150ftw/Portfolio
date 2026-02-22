/**
 * Performance Monitor Overlay
 *
 * Toggleable FPS counter + memory usage + render budget.
 * Shows recruiters you care about performance — a key trait at top companies.
 *
 * Activated: press Shift+P or type "perf" in the Terminal
 */
import { useEffect, useRef, useState, useCallback } from 'react'

export default function PerfMonitor() {
    const [visible, setVisible] = useState(false)
    const canvasRef = useRef(null)
    const statsRef = useRef({
        fps: 0,
        frames: 0,
        lastTime: performance.now(),
        fpsHistory: new Array(60).fill(0),
        historyIndex: 0,
        memory: 0,
        renderTime: 0,
    })

    // Toggle with Shift+P
    useEffect(() => {
        const handleKey = (e) => {
            if (e.shiftKey && e.key === 'P') {
                setVisible(v => !v)
            }
        }
        // Also listen for custom event from Terminal
        const handleCustom = () => setVisible(v => !v)
        window.addEventListener('keydown', handleKey)
        window.addEventListener('toggle-perf-monitor', handleCustom)
        return () => {
            window.removeEventListener('keydown', handleKey)
            window.removeEventListener('toggle-perf-monitor', handleCustom)
        }
    }, [])

    // FPS counting and rendering
    useEffect(() => {
        if (!visible) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        canvas.width = 220
        canvas.height = 120

        let animId
        const tick = () => {
            const stats = statsRef.current
            const now = performance.now()
            stats.frames++

            if (now - stats.lastTime >= 1000) {
                stats.fps = stats.frames
                stats.frames = 0
                stats.lastTime = now
                stats.fpsHistory[stats.historyIndex] = stats.fps
                stats.historyIndex = (stats.historyIndex + 1) % 60

                // Memory (Chrome only)
                if (performance.memory) {
                    stats.memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(1)
                }
            }

            // Render the monitor
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
            ctx.fillRect(0, 0, 220, 120)

            // Border
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)'
            ctx.lineWidth = 1
            ctx.strokeRect(0, 0, 220, 120)

            // FPS number
            const fpsColor = stats.fps >= 55 ? '#00ff41' : stats.fps >= 30 ? '#ffaa00' : '#ff4444'
            ctx.fillStyle = fpsColor
            ctx.font = 'bold 24px monospace'
            ctx.fillText(`${stats.fps} FPS`, 8, 28)

            // Frame budget
            const budget = ((1000 / 60) / (1000 / Math.max(stats.fps, 1)) * 100).toFixed(0)
            ctx.fillStyle = 'rgba(255,255,255,0.5)'
            ctx.font = '10px monospace'
            ctx.fillText(`Budget: ${Math.min(budget, 100)}%`, 130, 24)

            // Memory
            if (stats.memory) {
                ctx.fillStyle = 'rgba(168, 85, 247, 0.8)'
                ctx.font = '11px monospace'
                ctx.fillText(`MEM: ${stats.memory} MB`, 8, 44)
            }

            // FPS graph
            const graphY = 55
            const graphH = 50
            const graphW = 204
            ctx.fillStyle = 'rgba(255,255,255,0.03)'
            ctx.fillRect(8, graphY, graphW, graphH)

            // 60fps line
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)'
            ctx.setLineDash([2, 4])
            ctx.beginPath()
            ctx.moveTo(8, graphY + graphH * (1 - 60 / 120))
            ctx.lineTo(8 + graphW, graphY + graphH * (1 - 60 / 120))
            ctx.stroke()
            ctx.setLineDash([])

            // Draw history
            ctx.beginPath()
            ctx.strokeStyle = fpsColor
            ctx.lineWidth = 1.5
            for (let i = 0; i < 60; i++) {
                const idx = (stats.historyIndex + i) % 60
                const val = stats.fpsHistory[idx]
                const x = 8 + (i / 59) * graphW
                const y = graphY + graphH * (1 - Math.min(val, 120) / 120)
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.stroke()

            // Labels
            ctx.fillStyle = 'rgba(255,255,255,0.25)'
            ctx.font = '8px monospace'
            ctx.fillText('120', 212, graphY + 8)
            ctx.fillText('60', 212, graphY + graphH / 2)
            ctx.fillText('0', 212, graphY + graphH)
            ctx.fillText('Shift+P to close', 50, 115)

            animId = requestAnimationFrame(tick)
        }

        tick()
        return () => cancelAnimationFrame(animId)
    }, [visible])

    if (!visible) return null

    return (
        <div
            className="fixed top-4 right-4 z-[9998] select-none"
            style={{ pointerEvents: 'none' }}
        >
            <canvas
                ref={canvasRef}
                style={{ borderRadius: 6, opacity: 0.9 }}
            />
        </div>
    )
}
