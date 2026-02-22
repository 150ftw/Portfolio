import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'

const skills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
    'Three.js', 'Next.js', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'Docker', 'AWS', 'Figma', 'Git', 'Tailwind CSS',
    'Redux', 'Firebase', 'REST APIs', 'CI/CD', 'Linux',
]

function fibonacciSphere(samples) {
    const points = []
    const phi = Math.PI * (Math.sqrt(5) - 1) // golden angle
    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = phi * i
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius
        points.push([x, y, z])
    }
    return points
}

function SkillLabel({ position, text }) {
    const ref = useRef()

    useFrame(({ camera }) => {
        if (ref.current) {
            ref.current.lookAt(camera.position)
        }
    })

    return (
        <group ref={ref} position={position}>
            <Text
                fontSize={0.14}
                color="#e2e8f0"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"
                outlineWidth={0.005}
                outlineColor="#00f5ff"
            >
                {text}
            </Text>
        </group>
    )
}

export default function SkillSphere() {
    const groupRef = useRef()

    const points = useMemo(() => fibonacciSphere(skills.length), [])

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
        }
    })

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={0.3} color="#00f5ff" />

            <group ref={groupRef} scale={2.2}>
                {skills.map((skill, i) => (
                    <SkillLabel
                        key={skill}
                        text={skill}
                        position={[points[i][0], points[i][1], points[i][2]]}
                    />
                ))}

                {/* Wireframe sphere for structure */}
                <mesh>
                    <sphereGeometry args={[0.95, 20, 20]} />
                    <meshBasicMaterial
                        color="#a855f7"
                        wireframe
                        transparent
                        opacity={0.06}
                    />
                </mesh>
            </group>
        </>
    )
}
