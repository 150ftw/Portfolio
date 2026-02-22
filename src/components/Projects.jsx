import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Github, ArrowUpRight, ExternalLink } from 'lucide-react'
import HolographicCard from './ui/HolographicCard'
import SplitText from './ui/SplitText'
import TextScramble from './ui/TextScramble'

const categories = ['All', 'AI / ML', 'AR / Mobile', '3D / Creative', 'Blockchain']

const projects = [
    {
        id: 1,
        title: 'CalmSphere AI',
        description: 'AI-powered mental wellness assistant that provides personalized emotional support, stress analysis, and guided coping strategies through intelligent conversations.',
        category: 'AI / ML',
        tags: ['Python', 'OpenAI API', 'React', 'Node.js', 'Firebase', 'NLP'],
        color: '#00f5ff',
        gradient: 'linear-gradient(135deg, #0c2038 0%, #143858 25%, #1a5070 50%, #0e2d48 100%)',
        pattern: 'radial-gradient(ellipse at 65% 25%, rgba(0,245,255,0.4) 0%, transparent 55%), radial-gradient(circle at 25% 75%, rgba(168,85,247,0.15) 0%, transparent 50%)',
        image: '/images/project-calmsphere.png',
        size: 'large',
        year: '2026',
        github: 'https://github.com/150ftw/CalmSphereAI',
    },
    {
        id: 2,
        title: 'ArchDO',
        description: 'AR-based application that helps users detect hidden pipelines, wiring, and structural elements behind walls for safe drilling and home modifications.',
        category: 'AR / Mobile',
        tags: ['Unity', 'ARCore', 'MetaMask', 'C#', 'Firebase'],
        color: '#a855f7',
        gradient: 'linear-gradient(135deg, #1a1040 0%, #30188a 30%, #3d2090 60%, #1a0d3d 100%)',
        pattern: 'radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.45) 0%, transparent 55%), radial-gradient(circle at 85% 75%, rgba(236,72,153,0.2) 0%, transparent 50%)',
        image: '/images/project-archdo.png',
        size: 'small',
        year: '2024',
        github: 'https://github.com/150ftw/ArchDo',
    },
    {
        id: 3,
        title: 'Solar System Explorer',
        description: 'Interactive 3D solar system simulation that visualizes planetary motion, orbital mechanics, and space exploration using real-time rendering.',
        category: '3D / Creative',
        tags: ['Three.js', 'JavaScript', 'WebGL'],
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #2a1030 0%, #4a1a48 30%, #3d1540 60%, #200d25 100%)',
        pattern: 'radial-gradient(ellipse at 55% 30%, rgba(236,72,153,0.4) 0%, transparent 55%), radial-gradient(circle at 20% 65%, rgba(245,158,11,0.15) 0%, transparent 50%)',
        image: '/images/project-solar.png',
        size: 'small',
        year: '2026',
        github: 'https://github.com/150ftw/Solar-System-Explorer',
        live: 'https://solar-explorer.vercel.app',
    },
    {
        id: 4,
        title: 'Veggie Trace',
        description: 'Blockchain-powered platform that tracks vegetables from farm to consumer, ensuring transparency, authenticity, and supply chain trust.',
        category: 'Blockchain',
        tags: ['Ethereum', 'MetaMask', 'JavaScript', 'Firebase'],
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #0d2815 0%, #154528 30%, #1a5530 60%, #0c2010 100%)',
        pattern: 'radial-gradient(ellipse at 40% 35%, rgba(34,197,94,0.4) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(0,245,255,0.12) 0%, transparent 50%)',
        image: '/images/project-veggie.png',
        size: 'small',
        year: '2024',
        github: 'https://github.com/150ftw/Veggie-Trace',
        live: 'https://trace-veg.vercel.app/',
    },
    {
        id: 5,
        title: 'AcademiQ',
        description: 'Cloud-based academic result management system that automates result generation, storage, and performance analysis for educational institutions.',
        category: 'AI / ML',
        tags: ['Python', 'Firebase', 'Cloud', 'JavaScript'],
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #2a1e0c 0%, #4a3318 25%, #3d2a12 50%, #201808 100%)',
        pattern: 'radial-gradient(ellipse at 45% 25%, rgba(245,158,11,0.4) 0%, transparent 55%), radial-gradient(circle at 85% 70%, rgba(236,72,153,0.15) 0%, transparent 50%)',
        image: '/images/project-academiq.png',
        size: 'small',
        year: '2025',
        github: 'https://github.com/150ftw/Automated-Result-Management-System',
        live: 'https://v0-new-project-eqvkwiabdno.vercel.app/',
    },
]

function ProjectCard({ project, index }) {
    const [isHovered, setIsHovered] = useState(false)

    const sizeClasses = {
        large: 'md:col-span-2 md:row-span-2',
        medium: 'md:col-span-2',
        small: '',
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={`${sizeClasses[project.size]}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <HolographicCard
                className="group relative h-full overflow-hidden rounded-2xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    minHeight: project.size === 'large' ? '420px' : '280px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                tiltAmount={8}
                glareOpacity={0.1}
            >
                {/* Visual preview area — top section */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        minHeight: project.size === 'large' ? '220px' : '140px',
                        flex: '1 1 auto',
                    }}
                >
                    {/* Vibrant gradient background */}
                    <div
                        className="absolute inset-0 transition-transform duration-700"
                        style={{
                            background: project.gradient,
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                    />

                    {/* Bright color glow overlay */}
                    <div className="absolute inset-0" style={{ background: project.pattern }} />

                    {/* Grid mesh overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(${project.color}18 1px, transparent 1px),
                                linear-gradient(90deg, ${project.color}18 1px, transparent 1px)
                            `,
                            backgroundSize: '30px 30px',
                            opacity: 0.4,
                        }}
                    />

                    {/* Project image */}
                    {project.image && (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                            style={{
                                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                                opacity: 0.85,
                            }}
                        />
                    )}

                    {/* Floating geometric accent */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            y: [0, -8, 0],
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                        }}
                        className="absolute"
                        style={{
                            top: '12%',
                            left: '8%',
                            width: '40px',
                            height: '40px',
                            border: `1px solid ${project.color}40`,
                            borderRadius: project.id % 2 === 0 ? '50%' : '4px',
                            opacity: 0.5,
                        }}
                    />

                    {/* Year badge */}
                    <div
                        className="absolute top-3 right-3 rounded-full px-3 py-1"
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {project.year}
                        </span>
                    </div>

                    {/* Bottom fade into content */}
                    <div
                        className="absolute right-0 bottom-0 left-0 h-16"
                        style={{
                            background: 'linear-gradient(transparent, rgba(10,10,15,0.95))',
                        }}
                    />
                </div>

                {/* Content area — bottom half */}
                <div className="relative p-6 md:p-8" style={{ marginTop: '-12px' }}>
                    {/* Color accent line */}
                    <div className="relative mb-4">
                        <div
                            className="h-[2px] rounded-full transition-all duration-500"
                            style={{
                                background: `linear-gradient(90deg, ${project.color}, ${project.color}40)`,
                                width: isHovered ? '80px' : '40px',
                            }}
                        />
                        <div
                            className="absolute top-0 left-0 h-[2px] rounded-full transition-all duration-500"
                            style={{
                                background: project.color,
                                filter: 'blur(4px)',
                                opacity: 0.5,
                                width: isHovered ? '80px' : '40px',
                            }}
                        />
                    </div>

                    {/* Project number */}
                    <span
                        className="mb-2 block text-[10px] font-mono tracking-widest"
                        style={{ color: `${project.color}60` }}
                    >
                        PROJECT /{String(project.id).padStart(2, '0')}
                    </span>

                    {/* Title */}
                    <h3
                        className="mb-3 text-xl font-bold tracking-tight md:text-2xl"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
                    >
                        <TextScramble text={project.title} trigger="hover" />
                    </h3>

                    {/* Description */}
                    <p
                        className="mb-5 max-w-md text-xs leading-relaxed md:text-sm"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                        {project.description}
                    </p>

                    {/* Tags + Actions row */}
                    <div className="flex items-end justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full px-3 py-1 text-[10px] font-medium tracking-wide"
                                    style={{
                                        background: `${project.color}08`,
                                        border: `1px solid ${project.color}15`,
                                        color: `${project.color}`,
                                        opacity: 0.7,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Action buttons — always visible but subtle */}
                        <div
                            className="flex items-center gap-2 transition-all duration-500"
                            style={{ opacity: isHovered ? 1 : 0.3 }}
                        >
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="magnetic flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    <Github size={14} />
                                </a>
                            )}
                            {project.live && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="magnetic flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                                    style={{
                                        background: `${project.color}12`,
                                        border: `1px solid ${project.color}25`,
                                        color: project.color,
                                    }}
                                >
                                    <ArrowUpRight size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </HolographicCard>
        </motion.div>
    )
}

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState('All')
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

    const filtered = activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.category === activeCategory)

    return (
        <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden">
            {/* Multiple ambient lights */}
            <div
                className="pointer-events-none absolute top-1/4 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }}
            />
            <div
                className="pointer-events-none absolute bottom-1/3 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7 }}
                    className="mb-6"
                >
                    <span className="mb-3 block text-xs tracking-[0.3em] uppercase" style={{ color: '#00f5ff' }}>
                        <TextScramble text="Selected Work" trigger="view" />
                    </span>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <SplitText
                            text="Featured "
                            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                            animation="rise"
                            delay={0.1}
                        />
                        <SplitText
                            text="Projects"
                            className="text-4xl font-bold tracking-tight gradient-text md:text-5xl lg:text-6xl"
                            animation="blur"
                            delay={0.3}
                        />
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12 max-w-lg text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                    A curated collection of projects that showcase my expertise
                    in building immersive digital experiences.
                </motion.p>

                {/* Category filter with active indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-10 flex flex-wrap gap-2"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="magnetic relative rounded-full px-5 py-2.5 text-xs font-medium tracking-wide transition-all duration-400"
                            style={{
                                background: activeCategory === cat ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                border: `1px solid ${activeCategory === cat ? 'rgba(0, 245, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)'}`,
                                color: activeCategory === cat ? '#00f5ff' : 'rgba(255,255,255,0.4)',
                                boxShadow: activeCategory === cat ? '0 0 25px rgba(0,245,255,0.08), inset 0 1px 0 rgba(0,245,255,0.1)' : 'none',
                            }}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute -bottom-[1px] left-1/4 right-1/4 h-[2px] rounded-full"
                                    style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff40' }}
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Bento Grid */}
                <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    )
}
