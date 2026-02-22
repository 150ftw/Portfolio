import { Github, Linkedin, Twitter, Heart, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
]

const navLinks = ['Home', 'About', 'Work', 'Skills', 'Contact']

export default function Footer() {
    return (
        <footer className="relative overflow-hidden px-6 py-16 md:px-12">
            {/* Top border gradient */}
            <div
                className="absolute top-0 right-0 left-0 h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.15), rgba(168,85,247,0.15), transparent)',
                }}
            />

            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute -bottom-32 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.02]"
                style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-7xl">
                {/* Top row: Brand + Nav + Social */}
                <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="mb-3 flex items-center gap-1">
                            <span
                                className="text-2xl font-bold"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                                <span className="gradient-text">S</span>
                                <span className="text-white/70">.</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            Creative developer crafting immersive digital experiences at the intersection of design and technology.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="mb-4 text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            Navigation
                        </p>
                        <ul className="space-y-2.5">
                            {navLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        className="group flex items-center gap-1.5 text-xs transition-colors duration-300"
                                        style={{ color: 'rgba(255,255,255,0.35)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#00f5ff' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
                                    >
                                        <span className="inline-block h-[1px] w-3 rounded-full transition-all duration-300 group-hover:w-6" style={{ background: 'currentColor' }} />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <p className="mb-4 text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            Connect
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="magnetic flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        color: 'rgba(255,255,255,0.3)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)'
                                        e.currentTarget.style.color = '#00f5ff'
                                        e.currentTarget.style.background = 'rgba(0,245,255,0.06)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                    }}
                                    aria-label={link.label}
                                >
                                    <link.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row: Copyright line */}
                <div
                    className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                    <p className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        © {new Date().getFullYear()} Shivam Sharma — Designed & built with
                        <Heart size={10} className="mx-0.5" style={{ color: '#ec4899' }} />
                    </p>
                    <a
                        href="#home"
                        className="group flex items-center gap-1 text-[11px] transition-colors duration-300"
                        style={{ color: 'rgba(255,255,255,0.2)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#00f5ff' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)' }}
                    >
                        Back to top
                        <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
