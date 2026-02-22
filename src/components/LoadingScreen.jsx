import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsVisible(false)
                        setTimeout(() => onComplete?.(), 600)
                    }, 400)
                    return 100
                }
                return prev + Math.random() * 12 + 3
            })
        }, 80)

        return () => clearInterval(interval)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: '#0a0a0f' }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                    {/* Animated background grid */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)',
                                backgroundSize: '60px 60px',
                            }}
                        />
                    </div>

                    {/* Logo / Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h1
                            className="text-5xl font-bold tracking-tight"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            <span className="gradient-text">S</span>
                            <span className="text-white/90">hivam</span>
                        </h1>
                    </motion.div>

                    {/* Progress bar container */}
                    <div className="relative w-64">
                        <div
                            className="h-[2px] w-full overflow-hidden rounded-full"
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #00f5ff, #a855f7, #ec4899)',
                                    width: `${Math.min(progress, 100)}%`,
                                }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Progress text */}
                        <motion.p
                            className="mt-4 text-center text-sm tracking-widest"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            {Math.min(Math.round(progress), 100)}%
                        </motion.p>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="pointer-events-none absolute top-8 left-8 h-16 w-16 border-l border-t" style={{ borderColor: 'rgba(0,245,255,0.2)' }} />
                    <div className="pointer-events-none absolute right-8 bottom-8 h-16 w-16 border-r border-b" style={{ borderColor: 'rgba(168,85,247,0.2)' }} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
