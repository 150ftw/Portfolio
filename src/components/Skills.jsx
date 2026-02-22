import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SplitText from './ui/SplitText'
import TextScramble from './ui/TextScramble'

/* ── Skill data (3-4 per category) ──────────────────── */
const milestones = [
    {
        title: 'Frontend',
        subtitle: 'Crafting interfaces',
        color: '#00f5ff',
        icon: '◇',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
        title: 'Backend',
        subtitle: 'Building foundations',
        color: '#a855f7',
        icon: '⬡',
        skills: ['Node.js', 'Python', 'PostgreSQL'],
    },
    {
        title: 'Tools & DevOps',
        subtitle: 'Shipping & scaling',
        color: '#ec4899',
        icon: '△',
        skills: ['Git', 'Docker', 'AWS', 'Figma'],
    },
]

/* ── Glass pill tag for each skill ──────────────────── */
function SkillPill({ name, color, index, isInView }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
                duration: 0.5,
                delay: 0.08 * index,
                ease: [0.23, 1, 0.32, 1],
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300"
            style={{
                background: `${color}0a`,
                border: `1px solid ${color}20`,
                color: `${color}cc`,
                fontFamily: 'Space Grotesk, sans-serif',
            }}
            whileHover={{
                scale: 1.08,
                boxShadow: `0 0 20px ${color}20`,
                borderColor: `${color}50`,
            }}
        >
            <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
            />
            {name}
        </motion.span>
    )
}

/* ── Single milestone on the timeline ───────────────── */
function TimelineMilestone({ milestone, index, isInView }) {
    const isEven = index % 2 === 0

    return (
        <div className="relative flex flex-row items-center" style={{ minHeight: '140px' }}>
            {/* ── Desktop: Left content area ── */}
            <div className="hidden md:flex items-center" style={{ width: 'calc(50% - 24px)', order: 1 }}>
                {isEven ? (
                    <div className="ml-auto w-full flex items-center">
                        <MilestoneContent milestone={milestone} index={index} isInView={isInView} align="right" />
                        {/* Connector line to node */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={isInView ? { width: '24px', opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.15 * index + 0.3 }}
                            className="flex-shrink-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent, ${milestone.color}40)` }}
                        />
                    </div>
                ) : (
                    <div />
                )}
            </div>

            {/* Center node (on the timeline line) */}
            <div className="relative z-10 flex flex-shrink-0 items-center justify-center" style={{ width: '48px', order: 2 }}>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 * index, ease: [0.34, 1.56, 0.64, 1] }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-sm"
                    style={{
                        background: `${milestone.color}12`,
                        border: `1.5px solid ${milestone.color}30`,
                        color: milestone.color,
                        boxShadow: `0 0 24px ${milestone.color}15, inset 0 0 12px ${milestone.color}08`,
                    }}
                >
                    {milestone.icon}
                    {/* Pulse ring */}
                    <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ border: `1px solid ${milestone.color}` }}
                        animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 * index }}
                    />
                </motion.div>
            </div>

            {/* ── Desktop: Right content area ── */}
            <div className="hidden md:flex items-center" style={{ width: 'calc(50% - 24px)', order: 3 }}>
                {!isEven ? (
                    <div className="w-full flex items-center">
                        {/* Connector line from node */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={isInView ? { width: '24px', opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.15 * index + 0.3 }}
                            className="flex-shrink-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, ${milestone.color}40, transparent)` }}
                        />
                        <MilestoneContent milestone={milestone} index={index} isInView={isInView} align="left" />
                    </div>
                ) : (
                    <div />
                )}
            </div>

            {/* ── Mobile: always on the right ── */}
            <div className="flex-1 md:hidden pl-3">
                <MilestoneContent milestone={milestone} index={index} isInView={isInView} align="left" />
            </div>
        </div>
    )
}

/* ── The content card for a milestone ───────────────── */
function MilestoneContent({ milestone, index, isInView, align }) {
    const fromX = align === 'right' ? 40 : -40

    return (
        <motion.div
            initial={{ opacity: 0, x: fromX }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 * index + 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-2xl p-5 md:p-6"
            style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Top accent line */}
            <div
                className="absolute top-0 right-4 left-4 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${milestone.color}40, transparent)` }}
            />

            {/* Title & subtitle */}
            <div className="mb-4">
                <h3
                    className="text-base font-bold tracking-tight md:text-lg"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
                >
                    {milestone.title}
                </h3>
                <span
                    className="text-[11px] tracking-widest uppercase"
                    style={{ color: `${milestone.color}80` }}
                >
                    {milestone.subtitle}
                </span>
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2">
                {milestone.skills.map((skill, i) => (
                    <SkillPill
                        key={skill}
                        name={skill}
                        color={milestone.color}
                        index={i + index * 3}
                        isInView={isInView}
                    />
                ))}
            </div>
        </motion.div>
    )
}

/* ── Main Skills Section ────────────────────────────── */
export default function Skills() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

    return (
        <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden">
            {/* Ambient background */}
            <div
                className="pointer-events-none absolute top-1/4 left-0 h-[600px] w-[600px] rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
            />
            <div
                className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7 }}
                    className="mb-6 text-center"
                >
                    <span className="mb-3 block text-xs tracking-[0.3em] uppercase" style={{ color: '#00f5ff' }}>
                        <TextScramble text="Skills" trigger="view" />
                    </span>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <SplitText
                            text="Skills & "
                            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                            style={{ justifyContent: 'center' }}
                            animation="rise"
                            delay={0.1}
                        />
                        <motion.span
                            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                            transition={{ delay: 0.3, duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
                            className="block text-4xl font-bold tracking-tight gradient-text md:text-5xl lg:text-6xl"
                        >
                            Technology
                        </motion.span>
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mx-auto mb-16 max-w-lg text-center text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                    A storyline of the tools and technologies I've mastered throughout my journey as a developer & designer.
                </motion.p>

                {/* ── Vertical Timeline ── */}
                <div className="relative pl-8 md:pl-0">
                    {/* The glowing vertical line */}
                    <div className="absolute left-[23px] top-0 bottom-0 w-[2px] md:left-1/2 md:-translate-x-1/2">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={isInView ? { height: '100%' } : {}}
                            transition={{ duration: 1.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full origin-top"
                            style={{
                                background: 'linear-gradient(180deg, #00f5ff40, #a855f740, #ec489940, transparent)',
                                boxShadow: '0 0 8px rgba(0,245,255,0.15)',
                            }}
                        />
                    </div>

                    {/* Milestones */}
                    <div className="relative space-y-10 md:space-y-14">
                        {milestones.map((milestone, i) => (
                            <TimelineMilestone
                                key={milestone.title}
                                milestone={milestone}
                                index={i}
                                isInView={isInView}
                            />
                        ))}
                    </div>

                    {/* Terminal dot at the end of the line */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1.5 }}
                        className="absolute left-[23px] md:left-1/2 md:-translate-x-1/2"
                        style={{ bottom: '-24px' }}
                    >
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #00f5ff, #a855f7)',
                                boxShadow: '0 0 12px rgba(0,245,255,0.3)',
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
