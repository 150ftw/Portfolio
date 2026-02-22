import { Suspense, useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Send, Mail, MapPin, Phone, ArrowUpRight, Sparkles, CheckCircle, XCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import ContactScene from './canvas/ContactScene'
import SplitText from './ui/SplitText'
import TextScramble from './ui/TextScramble'
import MagneticButton from './ui/MagneticButton'

const contactInfo = [
    { icon: Mail, label: 'Email', value: 'ss18244646@gmail.com', color: '#00f5ff', href: 'mailto:ss18244646@gmail.com' },
    { icon: MapPin, label: 'Location', value: 'Gurugram, India', color: '#a855f7', href: '#' },
    { icon: Phone, label: 'Phone', value: '+91 96675 10634', color: '#ec4899', href: 'tel:+91' },
]

const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/150ftw', color: '#00f5ff' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivam-sharma-331945284/', color: '#a855f7' },
    { label: 'Twitter', href: 'https://x.com/150_ftw', color: '#ec4899' },
    { label: 'Instagram', href: 'https://instagram.com/shiv_mmm', color: '#f59e0b' },
]

export default function Contact() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
    const [isMobile, setIsMobile] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [focusedField, setFocusedField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
    const formRef = useRef(null)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)

        emailjs
            .sendForm(
                'service_exrpy0q',
                'template_x7gjaub',
                formRef.current,
                'fwIMrMm9jEnWvH8wk'
            )
            .then(() => {
                setSubmitStatus('success')
                setFormData({ name: '', email: '', message: '' })
                setTimeout(() => setSubmitStatus(null), 5000)
            })
            .catch(() => {
                setSubmitStatus('error')
                setTimeout(() => setSubmitStatus(null), 5000)
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const inputClasses = (field) => ({
        background: focusedField === field
            ? 'rgba(0, 245, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${focusedField === field ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
        color: '#e2e8f0',
        outline: 'none',
        boxShadow: focusedField === field
            ? '0 0 30px rgba(0, 245, 255, 0.06), inset 0 1px 0 rgba(0, 245, 255, 0.05)'
            : 'none',
    })

    return (
        <section id="contact" ref={sectionRef} className="section-padding relative overflow-hidden">
            {/* Ambient background */}
            <div
                className="pointer-events-none absolute right-0 bottom-0 h-[700px] w-[700px] rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }}
            />
            <div
                className="pointer-events-none absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-[0.02]"
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
                        <TextScramble text="Get In Touch" trigger="view" />
                    </span>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <SplitText
                            text="Let's Work "
                            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
                            animation="rise"
                            delay={0.1}
                        />
                        <SplitText
                            text="Together"
                            className="text-4xl font-bold tracking-tight gradient-text md:text-5xl lg:text-6xl"
                            animation="blur"
                            delay={0.4}
                        />
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16 max-w-lg text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                    Have a project in mind? Let's create something extraordinary together.
                    I'm always open to discussing new opportunities.
                </motion.p>

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
                    {/* Left - Form (3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div
                            className="relative overflow-hidden rounded-2xl p-8 md:p-10"
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Top accent line */}
                            <div
                                className="absolute top-0 right-0 left-0 h-[1px]"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), rgba(168,85,247,0.3), transparent)',
                                }}
                            />

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                {/* Name & Email row */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="relative">
                                        <label
                                            className="mb-2.5 block text-[11px] font-medium tracking-widest uppercase transition-colors duration-300"
                                            style={{ color: focusedField === 'name' ? '#00f5ff' : 'rgba(255,255,255,0.3)' }}
                                        >
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="from_name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="John Doe"
                                            required
                                            className="w-full rounded-xl px-5 py-4 text-sm transition-all duration-500 placeholder:text-white/10"
                                            style={inputClasses('name')}
                                        />
                                    </div>

                                    <div className="relative">
                                        <label
                                            className="mb-2.5 block text-[11px] font-medium tracking-widest uppercase transition-colors duration-300"
                                            style={{ color: focusedField === 'email' ? '#00f5ff' : 'rgba(255,255,255,0.3)' }}
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="from_email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full rounded-xl px-5 py-4 text-sm transition-all duration-500 placeholder:text-white/10"
                                            style={inputClasses('email')}
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="relative">
                                    <label
                                        className="mb-2.5 block text-[11px] font-medium tracking-widest uppercase transition-colors duration-300"
                                        style={{ color: focusedField === 'message' ? '#00f5ff' : 'rgba(255,255,255,0.3)' }}
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Tell me about your project..."
                                        required
                                        rows={6}
                                        className="w-full resize-none rounded-xl px-5 py-4 text-sm transition-all duration-500 placeholder:text-white/10"
                                        style={inputClasses('message')}
                                    />
                                </div>

                                {/* Submit */}
                                <MagneticButton
                                    type="submit"
                                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-8 py-4.5 text-sm font-semibold transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))',
                                        border: '1px solid rgba(0,245,255,0.2)',
                                        color: '#fff',
                                    }}
                                    strength={0.12}
                                >
                                    {/* Shimmer effect */}
                                    <div
                                        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(168,85,247,0.2))',
                                        }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <Sparkles size={16} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                            </>
                                        )}
                                    </span>
                                </MagneticButton>
                                {/* Status toast */}
                                <AnimatePresence>
                                    {submitStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
                                            style={{
                                                background: submitStatus === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                border: `1px solid ${submitStatus === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                                color: submitStatus === 'success' ? '#22c55e' : '#ef4444',
                                            }}
                                        >
                                            {submitStatus === 'success' ? (
                                                <><CheckCircle size={16} /> Message sent successfully! I'll get back to you soon.</>
                                            ) : (
                                                <><XCircle size={16} /> Something went wrong. Please try again or email me directly.</>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right - Info + 3D (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col gap-6 lg:col-span-2"
                    >
                        {/* Contact info cards */}
                        {contactInfo.map((info, i) => (
                            <motion.a
                                key={info.label}
                                href={info.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-500"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = `${info.color}30`
                                    e.currentTarget.style.background = `${info.color}06`
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                                }}
                            >
                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                        background: `${info.color}10`,
                                        border: `1px solid ${info.color}20`,
                                    }}
                                >
                                    <info.icon size={18} style={{ color: info.color }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                        {info.label}
                                    </p>
                                    <p className="truncate text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {info.value}
                                    </p>
                                </div>
                                <ArrowUpRight
                                    size={16}
                                    className="shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100"
                                    style={{ color: info.color }}
                                />
                            </motion.a>
                        ))}

                        {/* Social links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="rounded-xl p-5"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <p className="mb-4 text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                Connect
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="magnetic flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-300"
                                        style={{
                                            color: 'rgba(255,255,255,0.4)',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.04)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = link.color
                                            e.currentTarget.style.borderColor = `${link.color}25`
                                            e.currentTarget.style.background = `${link.color}08`
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        {link.label}
                                        <ArrowUpRight size={12} />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* 3D scene (bottom) */}
                        {!isMobile && (
                            <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: '200px' }}>
                                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                                    <Suspense fallback={null}>
                                        <ContactScene />
                                    </Suspense>
                                </Canvas>
                                <div
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{
                                        background: 'radial-gradient(circle at center, rgba(0,245,255,0.05) 0%, transparent 60%)',
                                        border: '1px solid rgba(255,255,255,0.03)',
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
