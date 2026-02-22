import { Suspense, useState, useEffect, Component } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { ArrowDownRight, Github, Linkedin } from 'lucide-react'
import HeroScene from './canvas/HeroScene'
import SplitText from './ui/SplitText'
import TextScramble from './ui/TextScramble'
import MagneticButton from './ui/MagneticButton'
import InfiniteMarquee from './ui/InfiniteMarquee'
import { useMousePosition } from '../hooks/useMousePosition'

const marqueeWords = [
    'REACT', '•', 'THREE.JS', '•', 'NEXT.JS', '•', 'TYPESCRIPT', '•',
    'FRAMER MOTION', '•', 'GSAP', '•', 'WEBGL', '•', 'NODE.JS', '•',
    'TAILWIND', '•', 'FIGMA', '•', 'CREATIVE DEV', '•',
]

/* ─── Error Boundary for WebGL Canvas ──────────────── */
class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error) {
        console.warn('WebGL Canvas error caught:', error.message)
    }
    render() {
        if (this.state.hasError) {
            // Graceful fallback — gradient background instead of 3D
            return (
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.04) 0%, transparent 50%)',
                }} />
            )
        }
        return this.props.children
    }
}

export default function Hero() {
    const { normalized } = useMousePosition()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Handle WebGL context loss/recovery
    const handleCanvasCreated = ({ gl }) => {
        const canvas = gl.domElement
        canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.warn('WebGL context lost — will attempt recovery')
        })
        canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored')
        })
    }

    return (
        <section
            id="hero"
            className="relative flex min-h-screen flex-col overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%)' }}
        >
            {/* Full-screen 3D Canvas Background */}
            {!isMobile && (
                <div className="pointer-events-none absolute inset-0 z-0">
                    <CanvasErrorBoundary>
                        <Canvas
                            camera={{ position: [0, 0, 6], fov: 45 }}
                            style={{ width: '100%', height: '100%' }}
                            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                            onCreated={handleCanvasCreated}
                        >
                            <Suspense fallback={null}>
                                <HeroScene mouse={normalized} />
                            </Suspense>
                        </Canvas>
                    </CanvasErrorBoundary>
                </div>
            )}

            {/* Mobile gradient bg replacement */}
            {isMobile && (
                <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
                    <div
                        className="h-full w-full"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 40%, rgba(0,245,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(168,85,247,0.06) 0%, transparent 50%)',
                        }}
                    />
                </div>
            )}

            {/* Background grid */}
            <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            {/* Centered Content Overlay */}
            <div className="relative z-10 mx-auto flex flex-1 w-full max-w-5xl flex-col items-center justify-center px-8 sm:px-12 md:px-16 pt-24 md:pt-28 text-center">
                {/* Status badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mb-8"
                >
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase"
                        style={{
                            background: 'rgba(0, 245, 255, 0.06)',
                            border: '1px solid rgba(0, 245, 255, 0.12)',
                            color: '#00f5ff',
                        }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                        </span>
                        <TextScramble text="Available for work" trigger="mount" delay={800} speed={25} />
                    </span>
                </motion.div>

                {/* Heading — centered, large, dramatic */}
                <div className="space-y-1">
                    <div className="overflow-hidden">
                        <SplitText
                            text="Shivam Sharma"
                            className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', justifyContent: 'center' }}
                            animation="rise"
                            delay={0.6}
                            staggerDelay={0.04}
                        />
                    </div>
                    <div className="overflow-visible">
                        <motion.h1
                            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 1.0, duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
                            className="text-3xl leading-[1.15] font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl gradient-text"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Developer & Designer
                        </motion.h1>
                    </div>
                </div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="mt-8 max-w-lg"
                >
                    <TextScramble
                        text="I craft immersive digital experiences that blend cutting-edge technology with stunning design. Let's build something extraordinary."
                        trigger="mount"
                        delay={1400}
                        speed={20}
                        as="p"
                        className="text-base leading-relaxed md:text-lg"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                    />
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <MagneticButton
                        as="a"
                        href="#projects"
                        onClick={(e) => {
                            e.preventDefault()
                            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="group flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))',
                            border: '1px solid rgba(0, 245, 255, 0.25)',
                            color: '#fff',
                        }}
                        strength={0.3}
                    >
                        View My Work
                        <ArrowDownRight size={16} className="transition-transform group-hover:rotate-45" />
                    </MagneticButton>

                    <div className="flex items-center gap-3">
                        <MagneticButton
                            as="a"
                            href="https://github.com"
                            target="_blank"
                            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300"
                            style={{
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.4)',
                            }}
                            strength={0.4}
                        >
                            <Github size={18} />
                        </MagneticButton>
                        <MagneticButton
                            as="a"
                            href="https://linkedin.com"
                            target="_blank"
                            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300"
                            style={{
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.4)',
                            }}
                            strength={0.4}
                        >
                            <Linkedin size={18} />
                        </MagneticButton>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2 }}
                    className="mt-16 flex items-center gap-3"
                >
                    <div
                        className="flex h-10 w-6 items-start justify-center rounded-full p-1"
                        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <motion.div
                            className="h-2 w-1 rounded-full"
                            style={{ background: '#00f5ff' }}
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        Scroll to explore
                    </span>
                </motion.div>
            </div>

            {/* Infinite Marquee Ribbon */}
            <div className="relative z-10 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <InfiniteMarquee speed={0.8} className="py-5">
                    {marqueeWords.map((word, i) => (
                        <span
                            key={i}
                            className="mx-6 text-sm font-medium tracking-[0.2em]"
                            style={{
                                color: word === '•' ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.12)',
                                fontFamily: 'Space Grotesk, sans-serif',
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </InfiniteMarquee>
            </div>

            {/* Bottom gradient fade */}
            <div
                className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 z-[5]"
                style={{ background: 'linear-gradient(transparent, #0a0a0f)' }}
            />
        </section>
    )
}
