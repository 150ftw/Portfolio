import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import GlitchText from './ui/GlitchText'
import MagneticButton from './ui/MagneticButton'

const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = (window.scrollY / totalHeight) * 100
            setScrollProgress(progress)
            setIsScrolled(window.scrollY > 50)

            // Detect active section
            const sections = ['hero', 'about', 'projects', 'skills', 'contact']
            for (const id of sections.reverse()) {
                const el = document.getElementById(id)
                if (el && window.scrollY >= el.offsetTop - 200) {
                    setActiveSection(id)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (e, href) => {
        e.preventDefault()
        setMobileOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            {/* Scroll progress bar */}
            <div className="fixed top-0 right-0 left-0 z-[100] h-[2px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <motion.div
                    className="h-full"
                    style={{
                        width: `${scrollProgress}%`,
                        background: 'linear-gradient(90deg, #00f5ff, #a855f7, #ec4899)',
                        boxShadow: '0 0 10px rgba(0,245,255,0.3)',
                    }}
                />
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="fixed top-4 right-6 left-6 z-[90] mx-auto max-w-6xl rounded-2xl px-6 py-3 transition-all duration-500 md:top-6"
                style={{
                    background: isScrolled ? 'rgba(10, 10, 15, 0.75)' : 'rgba(10, 10, 15, 0.3)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: `1px solid ${isScrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                    boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
                }}
            >
                <div className="flex items-center justify-between">
                    {/* Logo with Glitch effect */}
                    <a
                        href="#hero"
                        onClick={(e) => handleNavClick(e, '#hero')}
                        className="text-xl font-bold"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        <GlitchText intensity="medium">
                            <span className="gradient-text">S</span>
                            <span className="text-white/80">.</span>
                        </GlitchText>
                    </a>

                    {/* Desktop links with magnetic effect */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <MagneticButton
                                key={link.label}
                                as="a"
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="relative rounded-lg px-4 py-2 text-sm tracking-wide transition-colors duration-300"
                                style={{
                                    color: activeSection === link.href.slice(1) ? '#00f5ff' : 'rgba(255,255,255,0.45)',
                                }}
                                strength={0.25}
                            >
                                {link.label}
                                {/* Active indicator dot */}
                                {activeSection === link.href.slice(1) && (
                                    <motion.div
                                        layoutId="activeNavDot"
                                        className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                                        style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </MagneticButton>
                        ))}
                    </div>

                    {/* CTA with magnetic */}
                    <MagneticButton
                        as="a"
                        href="#contact"
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="hidden rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 md:block"
                        style={{
                            background: 'rgba(0, 245, 255, 0.08)',
                            border: '1px solid rgba(0, 245, 255, 0.2)',
                            color: '#00f5ff',
                        }}
                        strength={0.3}
                    >
                        Let's Talk
                    </MagneticButton>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 flex flex-col gap-4 pb-4 md:hidden overflow-hidden"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-sm tracking-wide transition-colors duration-200"
                                    style={{
                                        color: activeSection === link.href.slice(1) ? '#00f5ff' : 'rgba(255,255,255,0.45)',
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    )
}
