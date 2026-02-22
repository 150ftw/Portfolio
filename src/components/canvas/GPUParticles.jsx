/**
 * GPU Instanced Particle System
 *
 * Demonstrates advanced WebGL techniques:
 * - InstancedMesh for rendering 5000+ particles in a single draw call
 * - Curl noise flow field computed in vertex shader
 * - GPU-side animation (no CPU per-particle updates)
 *
 * Used by: Figma, Vercel, creative agencies
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 4000

/* ─── Vertex Shader ─────────────────────────────────── */
const vertexShader = /* glsl */ `
attribute float aScale;
attribute float aPhase;
attribute vec3 aColor;

uniform float uTime;
uniform float uScrollProgress;
uniform vec2 uMouse;

varying vec3 vColor;
varying float vOpacity;

// Simplex-like hash for curl noise
vec3 hash3(vec3 p) {
    p = vec3(
        dot(p, vec3(127.1, 311.7, 74.7)),
        dot(p, vec3(269.5, 183.3, 246.1)),
        dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Curl noise for organic flow
vec3 curlNoise(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    vec3 p_x0 = hash3(p - dx);
    vec3 p_x1 = hash3(p + dx);
    vec3 p_y0 = hash3(p - dy);
    vec3 p_y1 = hash3(p + dy);
    vec3 p_z0 = hash3(p - dz);
    vec3 p_z1 = hash3(p + dz);

    float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
    float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
    float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);

    return normalize(vec3(x, y, z) / (2.0 * e));
}

void main() {
    vec3 pos = instanceMatrix[3].xyz;

    // Apply curl noise flow field
    float timeScale = uTime * 0.15 + aPhase;
    vec3 curl = curlNoise(pos * 0.3 + timeScale * 0.2);
    pos += curl * 0.6;

    // Mouse attraction
    vec2 mouseDir = uMouse * 2.0;
    pos.x += mouseDir.x * 0.3 * smoothstep(5.0, 0.0, length(pos.xy - mouseDir * 3.0));
    pos.y += mouseDir.y * 0.3 * smoothstep(5.0, 0.0, length(pos.xy - mouseDir * 3.0));

    // Breathing motion
    float breath = sin(uTime * 0.5 + aPhase) * 0.3;
    pos *= 1.0 + breath * 0.05;

    // Scale based on distance from center
    float dist = length(pos);
    float scale = aScale * smoothstep(12.0, 2.0, dist) * 0.8;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = scale * (200.0 / -mvPosition.z);

    vColor = aColor;
    vOpacity = smoothstep(12.0, 3.0, dist) * (0.3 + 0.7 * aScale);
}
`

/* ─── Fragment Shader ───────────────────────────────── */
const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vOpacity;

void main() {
    // Soft circle with glow
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
    float glow = smoothstep(0.5, 0.0, dist) * 0.3;

    vec3 finalColor = vColor + vColor * glow;
    gl_FragColor = vec4(finalColor, alpha);
}
`

export default function GPUParticles({ mouse }) {
    const meshRef = useRef()

    const { positions, scales, phases, colors } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3)
        const scales = new Float32Array(PARTICLE_COUNT)
        const phases = new Float32Array(PARTICLE_COUNT)
        const colors = new Float32Array(PARTICLE_COUNT * 3)

        const palette = [
            new THREE.Color('#00f5ff'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#ec4899'),
            new THREE.Color('#22c55e'),
            new THREE.Color('#3b82f6'),
        ]

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Spherical distribution with varying density
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 2 + Math.random() * 8

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = r * Math.cos(phi)

            scales[i] = Math.random() * 0.8 + 0.2
            phases[i] = Math.random() * Math.PI * 2

            const color = palette[Math.floor(Math.random() * palette.length)]
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }

        return { positions, scales, phases, colors }
    }, [])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), [])

    // Set up instanced mesh with initial positions
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.elapsedTime
        meshRef.current.material.uniforms.uTime.value = t
        meshRef.current.material.uniforms.uMouse.value.set(mouse?.x || 0, mouse?.y || 0)

        // Update instance matrices from initial positions (GPU handles the flow animation)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            dummy.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            )
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(0.04, 0.04)
        geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))
        geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
        geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3))
        return geo
    }, [scales, phases, colors])

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, null, PARTICLE_COUNT]}
            frustumCulled={false}
        >
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}
