import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Code2, Palette, Zap, Globe, ArrowDownRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from './ui/SplitText'
import TextScramble from './ui/TextScramble'
import HolographicCard from './ui/HolographicCard'

gsap.registerPlugin(ScrollTrigger)

const stats = [
    { label: 'Years Experience', value: '2+', color: '#00f5ff' },
    { label: 'Projects Completed', value: '10+', color: '#a855f7' },
    { label: 'Happy Clients', value: '5+', color: '#ec4899' },
    { label: 'Technologies', value: '14+', color: '#22c55e' },
]

// Bento card visual config — each card gets unique visual elements
const bentoCards = [
    {
        icon: Code2,
        title: 'Full-Stack Dev',
        desc: 'Building scalable web applications with modern frameworks and clean architecture.',
        color: '#00f5ff',
        span: 'col-span-1 sm:col-span-1',
        visual: 'deploy-log',
    },
    {
        icon: Palette,
        title: 'UI/UX Design',
        desc: 'Crafting intuitive interfaces with meticulous attention to visual detail.',
        color: '#a855f7',
        span: 'col-span-1 sm:col-span-1',
        visual: 'color-swatches',
    },
    {
        icon: Zap,
        title: 'Performance',
        desc: 'Optimizing applications for blazing-fast load times and silky interactions.',
        color: '#ec4899',
        span: 'col-span-1 sm:col-span-1',
        visual: 'metrics',
    },
    {
        icon: Globe,
        title: '3D & Creative',
        desc: 'Creating immersive 3D web experiences with Three.js and WebGL.',
        color: '#22c55e',
        span: 'col-span-1 sm:col-span-1',
        visual: 'wireframe',
    },
]

function BentoVisual({ type, color }) {
    if (type === 'deploy-log') {
        return (
            <div
                className="mt-4 overflow-hidden rounded-lg"
                style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    lineHeight: '1.8',
                }}
            >
                <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#febc2e' }} />
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#28c840' }} />
                    <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '4px', fontSize: '9px' }}>build.log</span>
                </div>
                <div className="px-3 py-2">
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>$ npm run deploy</div>
                    <div style={{ color: '#00f5ff' }}>→ Building...</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>[1/4] Cloning repository...</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>[2/4] Installing dependencies...</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>[3/4] Running build script...</div>
                    <div style={{ color: '#22c55e' }}>[4/4] Deployment complete (1.2s)</div>
                </div>
            </div>
        )
    }

    if (type === 'color-swatches') {
        const swatches = ['#a855f7', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b', '#6366f1']
        return (
            <div className="mt-4">
                <div className="flex gap-2 mb-3">
                    {swatches.map((c, i) => (
                        <div
                            key={i}
                            className="h-6 flex-1 rounded-md transition-transform duration-300 hover:scale-110"
                            style={{ background: c, opacity: 0.8 }}
                        />
                    ))}
                </div>
                <div className="flex items-baseline gap-3">
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: '20px', fontWeight: 700 }}>
                        Aa
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
                        Space Grotesk / 700
                    </span>
                </div>
            </div>
        )
    }

    if (type === 'metrics') {
        return (
            <div className="mt-4">
                <div className="mb-3 flex items-baseline gap-1">
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                        98
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: 600 }}>/100</span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                        LIGHTHOUSE SCORE
                    </span>
                </div>
                <div className="flex gap-2 mt-2">
                    <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px]"
                        style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.15)', color: '#ec4899' }}
                    >
                        ⚡ Latency: &lt;30ms
                    </span>
                    <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px]"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                    >
                        ◈ Core Web Vitals
                    </span>
                </div>
            </div>
        )
    }

    if (type === 'wireframe') {
        return (
            <div className="mt-4 relative overflow-hidden rounded-lg" style={{ height: '80px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Dot grid */}
                <div className="absolute inset-0" style={{ opacity: 0.4 }}>
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-1 w-1 rounded-full"
                            style={{
                                background: i % 5 === 0 ? '#22c55e' : 'rgba(255,255,255,0.15)',
                                left: `${(i % 7) * 15 + 5}%`,
                                top: `${Math.floor(i / 7) * 22 + 10}%`,
                                boxShadow: i % 5 === 0 ? `0 0 6px ${color}40` : 'none',
                            }}
                        />
                    ))}
                </div>
                {/* Floating label */}
                <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>
                        WebGL • Three.js
                    </span>
                </div>
            </div>
        )
    }

    return null
}

export default function About() {
    const sectionRef = useRef(null)
    const cardsRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

    // Scroll velocity skew on cards
    useEffect(() => {
        if (!cardsRef.current) return

        const triggers = []
        const cards = cardsRef.current.querySelectorAll('.skew-card')
        cards.forEach((card) => {
            const st = ScrollTrigger.create({
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                    const velocity = self.getVelocity()
                    const skew = Math.max(-3, Math.min(3, velocity / 400))
                    gsap.to(card, { skewY: skew, duration: 0.3, ease: 'power2.out' })
                },
            })
            triggers.push(st)
        })

        return () => triggers.forEach((st) => st.kill())
    }, [isInView])

    return (
        <section id="about" ref={sectionRef} className="section-padding relative overflow-hidden">
            {/* Ambient background */}
            <div
                className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7 }}
                    className="mb-6"
                >
                    <span className="mb-3 block text-xs tracking-[0.3em] uppercase" style={{ color: '#00f5ff' }}>
                        <TextScramble text="About" trigger="view" />
                    </span>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <SplitText
                            text="Me"
                            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                            animation="rise"
                            delay={0.1}
                        />
                        <SplitText
                            text="Digital"
                            className="text-4xl font-bold tracking-tight gradient-text md:text-5xl lg:text-6xl"
                            animation="blur"
                            delay={0.3}
                        />
                        <br />
                        <SplitText
                            text="Experiences"
                            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                            animation="rise"
                            delay={0.5}
                        />
                    </h2>
                </motion.div>

                {/* Bio + Stats grid */}
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    {/* Left - Bio (7 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        {/* Two-paragraph bio with visual separator */}
                        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <p className="text-base leading-[1.8] md:text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                    I'm a passionate full-stack developer and creative designer who specializes in building immersive web experiences. With a deep love for the intersection of technology and art, I push the boundaries of what's possible on the web.
                                </p>
                            </div>
                            <div>
                                <p className="text-base leading-[1.8] md:text-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    From interactive 3D visualizations to pixel-perfect UI implementations, I bring ideas to life with clean code and thoughtful design. Every project is an opportunity to create something extraordinary.
                                </p>
                            </div>
                        </div>

                        {/* Stats row — redesigned as glass cards */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                    className="group relative overflow-hidden rounded-xl p-5 text-center transition-all duration-500"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${stat.color}25`
                                        e.currentTarget.style.background = `${stat.color}06`
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    {/* Top accent */}
                                    <div
                                        className="absolute top-0 right-0 left-0 h-[1px]"
                                        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}30, transparent)` }}
                                    />
                                    <div
                                        className="text-3xl font-bold md:text-4xl"
                                        style={{
                                            fontFamily: 'Space Grotesk, sans-serif',
                                            color: stat.color,
                                            textShadow: `0 0 30px ${stat.color}20`,
                                        }}
                                    >
                                        <TextScramble text={stat.value} trigger="view" delay={500 + i * 200} />
                                    </div>
                                    <div
                                        className="mt-2 text-[10px] font-medium tracking-widest uppercase"
                                        style={{ color: 'rgba(255,255,255,0.3)' }}
                                    >
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - Bento Service Cards (5 cols) */}
                    <div ref={cardsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
                        {bentoCards.map((card, i) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                className={`skew-card ${card.span}`}
                            >
                                <HolographicCard
                                    className="group h-full overflow-hidden rounded-2xl p-6"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                    tiltAmount={12}
                                    glareOpacity={0.08}
                                >
                                    {/* Card top accent */}
                                    <div
                                        className="absolute top-0 right-0 left-0 h-[1px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, ${card.color}40, transparent)`,
                                        }}
                                    />

                                    {/* Corner glow on hover */}
                                    <div
                                        className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                        style={{ background: `radial-gradient(circle, ${card.color}10, transparent 70%)` }}
                                    />

                                    <div className="relative">
                                        <div
                                            className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500"
                                            style={{
                                                background: `${card.color}10`,
                                                border: `1px solid ${card.color}20`,
                                            }}
                                        >
                                            <card.icon size={20} style={{ color: card.color }} />
                                        </div>
                                        <h3
                                            className="mb-2 text-sm font-bold tracking-tight"
                                            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(255,255,255,0.9)' }}
                                        >
                                            {card.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                            {card.desc}
                                        </p>

                                        {/* Bento visual element */}
                                        <BentoVisual type={card.visual} color={card.color} />
                                    </div>
                                </HolographicCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
