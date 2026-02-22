/**
 * Postprocessing Pipeline
 *
 * Cinematic-quality render effects:
 * - Selective Bloom (emissive elements glow)
 * - Chromatic Aberration (camera lens simulation)
 * - Vignette (cinematic framing)
 *
 * Used by: Apple, Awwwards-winning creative sites
 */
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function PostProcessing({ mouse }) {
    const chromaticRef = useRef()

    // Subtle chromatic aberration that increases with mouse movement
    useFrame(() => {
        if (chromaticRef.current) {
            const mx = Math.abs(mouse?.x || 0)
            const my = Math.abs(mouse?.y || 0)
            const intensity = (mx + my) * 0.0008
            chromaticRef.current.offset.set(
                Math.min(intensity, 0.003),
                Math.min(intensity, 0.003)
            )
        }
    })

    const offset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])

    return (
        <EffectComposer multisampling={0}>
            <Bloom
                intensity={0.8}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.9}
                mipmapBlur
            />
            <ChromaticAberration
                ref={chromaticRef}
                blendFunction={BlendFunction.NORMAL}
                offset={offset}
                radialModulation={true}
                modulationOffset={0.5}
            />
            <Vignette
                eskil={false}
                offset={0.25}
                darkness={0.6}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    )
}
