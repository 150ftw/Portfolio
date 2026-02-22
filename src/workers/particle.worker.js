/**
 * Web Worker — Off-Main-Thread Particle Physics
 *
 * Demonstrates understanding of the event loop and thread architecture.
 * Offloads computation to a separate thread so the main thread stays
 * buttery smooth at 60fps.
 *
 * Used by: Figma (entire renderer), Google Docs, VS Code
 *
 * Pattern: postMessage with Transferable Objects for zero-copy data transfer
 */

// Curl noise helper
function hash3(x, y, z) {
    const p1 = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
    const p2 = Math.sin(x * 269.5 + y * 183.3 + z * 246.1) * 43758.5453123
    const p3 = Math.sin(x * 113.5 + y * 271.9 + z * 124.6) * 43758.5453123
    return [
        -1 + 2 * (p1 - Math.floor(p1)),
        -1 + 2 * (p2 - Math.floor(p2)),
        -1 + 2 * (p3 - Math.floor(p3)),
    ]
}

function curlNoise(x, y, z) {
    const e = 0.1
    const px0 = hash3(x - e, y, z)
    const px1 = hash3(x + e, y, z)
    const py0 = hash3(x, y - e, z)
    const py1 = hash3(x, y + e, z)
    const pz0 = hash3(x, y, z - e)
    const pz1 = hash3(x, y, z + e)

    const cx = (py1[2] - py0[2]) - (pz1[1] - pz0[1])
    const cy = (pz1[0] - pz0[0]) - (px1[2] - px0[2])
    const cz = (px1[1] - px0[1]) - (py1[0] - py0[0])

    const len = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1
    return [cx / len / (2 * e), cy / len / (2 * e), cz / len / (2 * e)]
}

let particleCount = 0
let positions = null
let velocities = null

self.onmessage = function (e) {
    const { type, data } = e.data

    switch (type) {
        case 'init': {
            particleCount = data.count
            positions = new Float32Array(data.positions)
            velocities = new Float32Array(particleCount * 3)
            break
        }

        case 'update': {
            const { time, mouseX, mouseY, deltaTime } = data
            const dt = Math.min(deltaTime, 0.05) // Cap delta to prevent explosions

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3
                const x = positions[i3]
                const y = positions[i3 + 1]
                const z = positions[i3 + 2]

                // Curl noise flow field
                const [cx, cy, cz] = curlNoise(
                    x * 0.15 + time * 0.05,
                    y * 0.15 + time * 0.05,
                    z * 0.15
                )

                velocities[i3] += cx * 0.02 * dt
                velocities[i3 + 1] += cy * 0.02 * dt
                velocities[i3 + 2] += cz * 0.02 * dt

                // Mouse attraction
                const dx = mouseX * 3 - x
                const dy = mouseY * 3 - y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 5) {
                    const force = (5 - dist) / 5 * 0.001
                    velocities[i3] += dx * force * dt
                    velocities[i3 + 1] += dy * force * dt
                }

                // Damping
                velocities[i3] *= 0.98
                velocities[i3 + 1] *= 0.98
                velocities[i3 + 2] *= 0.98

                // Apply velocity
                positions[i3] += velocities[i3]
                positions[i3 + 1] += velocities[i3 + 1]
                positions[i3 + 2] += velocities[i3 + 2]

                // Boundary — keep particles in a sphere
                const r = Math.sqrt(
                    positions[i3] ** 2 +
                    positions[i3 + 1] ** 2 +
                    positions[i3 + 2] ** 2
                )
                if (r > 10) {
                    const scale = 10 / r
                    positions[i3] *= scale
                    positions[i3 + 1] *= scale
                    positions[i3 + 2] *= scale
                }
            }

            // Transfer the buffer back (zero-copy via Transferable)
            const buffer = positions.buffer.slice(0)
            self.postMessage({ type: 'positions', data: buffer }, [buffer])
            break
        }
    }
}
