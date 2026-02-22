import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import NoiseDistortionMesh from '../shaders/NoiseDistortionShader'
import GPUParticles from './GPUParticles'
import PostProcessing from './PostProcessing'

/* ─── Orbiting Rings ──────────────────────────────── */
function OrbitRing({ radius = 2, tube = 0.005, color = '#00f5ff', speed = 0.3, tiltX = 0, tiltZ = 0, opacity = 0.2, mouse }) {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ref.current) {
            ref.current.rotation.x = tiltX + t * speed * 0.5 + (mouse?.y || 0) * 0.12
            ref.current.rotation.y = t * speed + (mouse?.x || 0) * 0.12
            ref.current.rotation.z = tiltZ
        }
    })
    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, tube, 16, 120]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
    )
}

/* ─── Orbiting Satellite Spheres ─────────────────── */
function Satellites({ mouse }) {
    const groupRef = useRef()
    const satelliteData = useMemo(() => [
        { speed: 0.25, radius: 2.3, size: 0.06, color: '#00f5ff', phase: 0, tilt: 0.4 },
        { speed: -0.18, radius: 2.8, size: 0.04, color: '#a855f7', phase: 2.1, tilt: -0.6 },
        { speed: 0.32, radius: 1.9, size: 0.05, color: '#ec4899', phase: 4.2, tilt: 1.0 },
        { speed: -0.22, radius: 3.0, size: 0.035, color: '#00f5ff', phase: 1.0, tilt: -0.3 },
        { speed: 0.15, radius: 2.5, size: 0.045, color: '#a855f7', phase: 3.5, tilt: 0.8 },
        { speed: -0.28, radius: 2.0, size: 0.055, color: '#22c55e', phase: 5.0, tilt: -1.1 },
    ], [])

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = (mouse?.x || 0) * 0.08
            groupRef.current.rotation.x = (mouse?.y || 0) * 0.08
        }
    })

    return (
        <group ref={groupRef}>
            {satelliteData.map((sat, i) => (
                <SatelliteOrbit key={i} {...sat} />
            ))}
        </group>
    )
}

function SatelliteOrbit({ speed, radius, size, color, phase, tilt }) {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.elapsedTime * speed + phase
        if (meshRef.current) {
            meshRef.current.position.x = Math.cos(t) * radius
            meshRef.current.position.y = Math.sin(t) * radius * 0.3 + Math.sin(t * 0.7) * 0.3
            meshRef.current.position.z = Math.sin(t) * radius * Math.cos(tilt)
        }
    })
    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    )
}

/* ─── Main Scene Export ───────────────────────────── */
export default function HeroScene({ mouse }) {
    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} intensity={0.25} color="#00f5ff" />
            <pointLight position={[-5, -3, 3]} intensity={0.15} color="#a855f7" />
            <pointLight position={[0, -5, -3]} intensity={0.1} color="#ec4899" />

            {/* ★ Custom GLSL Shader Core — replaces basic wireframe */}
            <NoiseDistortionMesh mouse={mouse} scale={1.4} noiseScale={1.5} noiseStrength={0.3} />

            {/* Wireframe overlay for depth */}
            <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.2}>
                <mesh scale={1.6}>
                    <icosahedronGeometry args={[1, 2]} />
                    <meshBasicMaterial
                        color="#00f5ff"
                        wireframe
                        transparent
                        opacity={0.08}
                    />
                </mesh>
            </Float>

            <Satellites mouse={mouse} />

            {/* ★ GPU Instanced Particle System — 4000 particles */}
            <GPUParticles mouse={mouse} />

            {/* Orbiting rings */}
            <OrbitRing radius={2.3} color="#00f5ff" speed={0.2} tiltX={0.5} opacity={0.12} mouse={mouse} />
            <OrbitRing radius={2.8} color="#a855f7" speed={-0.15} tiltX={-0.7} tiltZ={0.4} opacity={0.08} mouse={mouse} />
            <OrbitRing radius={3.2} color="#ec4899" speed={0.12} tiltX={1.3} tiltZ={-0.6} opacity={0.05} mouse={mouse} />
            <OrbitRing radius={1.8} color="#22c55e" speed={0.28} tiltX={-0.3} tiltZ={0.8} opacity={0.06} mouse={mouse} />

            {/* ★ Cinematic Postprocessing */}
            <PostProcessing mouse={mouse} />
        </>
    )
}
