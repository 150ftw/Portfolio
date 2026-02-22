import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Pre-allocate reusable vectors outside component
const _tempVec = new THREE.Vector3()
const _dir = new THREE.Vector3()

export default function ParticleText({ text = 'SHIVAM', mouse }) {
    const instancedRef = useRef()
    const [positions, setPositions] = useState(null)
    const count = 1200 // Reduced from 2000

    // Generate text positions by sampling from canvas
    useEffect(() => {
        const canvas = document.createElement('canvas')
        const size = 512
        canvas.width = size
        canvas.height = size / 3
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 120px "Space Grotesk", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const points = []

        // Sample white pixels at wider stride
        for (let y = 0; y < canvas.height; y += 3) {
            for (let x = 0; x < canvas.width; x += 3) {
                const index = (y * canvas.width + x) * 4
                if (imageData.data[index] > 128) {
                    points.push({
                        x: (x / canvas.width - 0.5) * 8,
                        y: -(y / canvas.height - 0.5) * 3,
                        z: 0,
                    })
                }
            }
        }

        // Randomly sample down to count
        const sampled = []
        for (let i = 0; i < count; i++) {
            if (points.length > 0) {
                const idx = Math.floor(Math.random() * points.length)
                sampled.push(points[idx])
            } else {
                sampled.push({
                    x: (Math.random() - 0.5) * 8,
                    y: (Math.random() - 0.5) * 3,
                    z: 0,
                })
            }
        }

        setPositions(sampled)
    }, [text, count])

    // Store particle state in flat typed arrays for cache-friendly access
    const particleData = useMemo(() => {
        if (!positions) return null
        const origX = new Float32Array(count)
        const origY = new Float32Array(count)
        const origZ = new Float32Array(count)
        const curX = new Float32Array(count)
        const curY = new Float32Array(count)
        const curZ = new Float32Array(count)
        const velX = new Float32Array(count)
        const velY = new Float32Array(count)
        const velZ = new Float32Array(count)
        const sizes = new Float32Array(count)
        const colors = []

        for (let i = 0; i < positions.length; i++) {
            origX[i] = positions[i].x
            origY[i] = positions[i].y
            origZ[i] = positions[i].z
            curX[i] = positions[i].x + (Math.random() - 0.5) * 20
            curY[i] = positions[i].y + (Math.random() - 0.5) * 20
            curZ[i] = (Math.random() - 0.5) * 10
            sizes[i] = Math.random() * 0.03 + 0.01
            colors.push(new THREE.Color().setHSL(
                0.5 + Math.random() * 0.15,
                0.8 + Math.random() * 0.2,
                0.5 + Math.random() * 0.3,
            ))
        }

        return { origX, origY, origZ, curX, curY, curZ, velX, velY, velZ, sizes, colors }
    }, [positions, count])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Set colors once
    useEffect(() => {
        if (!particleData || !instancedRef.current) return
        for (let i = 0; i < particleData.colors.length; i++) {
            instancedRef.current.setColorAt(i, particleData.colors[i])
        }
        if (instancedRef.current.instanceColor) {
            instancedRef.current.instanceColor.needsUpdate = true
        }
    }, [particleData])

    useFrame(() => {
        if (!particleData || !instancedRef.current) return

        const { origX, origY, origZ, curX, curY, curZ, velX, velY, velZ, sizes } = particleData
        const mx = (mouse?.x || 0) * 4
        const my = (mouse?.y || 0) * 2
        const repulsionRadiusSq = 2.25 // 1.5^2

        for (let i = 0; i < count; i++) {
            // Mouse repulsion — avoid sqrt when out of range
            const dx = curX[i] - mx
            const dy = curY[i] - my
            const dz = curZ[i]
            const distSq = dx * dx + dy * dy + dz * dz

            if (distSq < repulsionRadiusSq) {
                const dist = Math.sqrt(distSq)
                const force = (1.5 - dist) / 1.5
                const invDist = 1 / (dist + 0.001)
                velX[i] += dx * invDist * force * 0.08
                velY[i] += dy * invDist * force * 0.08
                velZ[i] += dz * invDist * force * 0.08
            }

            // Spring back — inline math, no allocation
            velX[i] += (origX[i] - curX[i]) * 0.04
            velY[i] += (origY[i] - curY[i]) * 0.04
            velZ[i] += (origZ[i] - curZ[i]) * 0.04

            // Damping
            velX[i] *= 0.9
            velY[i] *= 0.9
            velZ[i] *= 0.9

            // Update position
            curX[i] += velX[i]
            curY[i] += velY[i]
            curZ[i] += velZ[i]

            // Set instance matrix
            dummy.position.set(curX[i], curY[i], curZ[i])
            const speed = Math.abs(velX[i]) + Math.abs(velY[i]) + Math.abs(velZ[i])
            dummy.scale.setScalar(sizes[i] * (1 + speed * 2))
            dummy.updateMatrix()
            instancedRef.current.setMatrixAt(i, dummy.matrix)
        }

        instancedRef.current.instanceMatrix.needsUpdate = true
    })

    if (!particleData) return null

    return (
        <instancedMesh ref={instancedRef} args={[null, null, count]}>
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    )
}
