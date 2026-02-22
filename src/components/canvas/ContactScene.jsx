import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/* ─── DNA-like Double Helix ─────────────────────────── */
function DoubleHelix() {
    const groupRef = useRef()
    const count = 28
    const helixData = useMemo(() => {
        const data = []
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 3
            const y = (i / count - 0.5) * 4
            data.push({
                pos1: [Math.cos(t) * 0.6, y, Math.sin(t) * 0.6],
                pos2: [Math.cos(t + Math.PI) * 0.6, y, Math.sin(t + Math.PI) * 0.6],
                color1: new THREE.Color().setHSL(0.52 + i / count * 0.1, 0.8, 0.6),
                color2: new THREE.Color().setHSL(0.78 + i / count * 0.1, 0.7, 0.5),
            })
        }
        return data
    }, [count])

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
        }
    })

    return (
        <group ref={groupRef}>
            {helixData.map((d, i) => (
                <group key={i}>
                    {/* Strand 1 */}
                    <mesh position={d.pos1}>
                        <sphereGeometry args={[0.035, 6, 6]} />
                        <meshBasicMaterial color={d.color1} transparent opacity={0.7} />
                    </mesh>
                    {/* Strand 2 */}
                    <mesh position={d.pos2}>
                        <sphereGeometry args={[0.035, 6, 6]} />
                        <meshBasicMaterial color={d.color2} transparent opacity={0.7} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

/* ─── Orbiting Rings ──────────────────────────────── */
function ContactRings() {
    const ref1 = useRef()
    const ref2 = useRef()

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ref1.current) {
            ref1.current.rotation.x = Math.sin(t * 0.3) * 0.3
            ref1.current.rotation.z = t * 0.15
        }
        if (ref2.current) {
            ref2.current.rotation.y = t * 0.12
            ref2.current.rotation.x = Math.cos(t * 0.25) * 0.4 + 0.8
        }
    })

    return (
        <>
            <mesh ref={ref1} scale={1.6}>
                <torusGeometry args={[1, 0.008, 16, 80]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
            </mesh>
            <mesh ref={ref2} scale={1.3}>
                <torusGeometry args={[1, 0.006, 16, 80]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
            </mesh>
        </>
    )
}

/* ─── Main Contact Scene Export ──────────────────── */
export default function ContactScene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[3, 3, 3]} intensity={0.4} color="#00f5ff" />
            <pointLight position={[-3, -3, 3]} intensity={0.2} color="#a855f7" />

            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                <DoubleHelix />
            </Float>

            <ContactRings />
        </>
    )
}
