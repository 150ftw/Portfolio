import { motion } from 'framer-motion'

export default function MorphingBlobs() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Use pre-blurred gradients instead of CSS blur filter on animated elements.
                The blur is baked into the gradient's falloff so no runtime filter is needed. */}

            {/* Blob 1 - Top right */}
            <motion.div
                className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.05]"
                style={{
                    background: 'radial-gradient(circle, #00f5ff 0%, rgba(0,245,255,0.3) 30%, rgba(0,245,255,0.05) 55%, transparent 70%)',
                    willChange: 'transform',
                }}
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.15, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Blob 2 - Bottom left */}
            <motion.div
                className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full opacity-[0.04]"
                style={{
                    background: 'radial-gradient(circle, #a855f7 0%, rgba(168,85,247,0.3) 30%, rgba(168,85,247,0.05) 55%, transparent 70%)',
                    willChange: 'transform',
                }}
                animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 40, -30, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Blob 3 - Center accent */}
            <motion.div
                className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-[0.03]"
                style={{
                    background: 'radial-gradient(circle, #ec4899 0%, rgba(236,72,153,0.3) 30%, rgba(236,72,153,0.05) 55%, transparent 70%)',
                    willChange: 'transform',
                }}
                animate={{
                    x: ['-50%', 'calc(-50% + 50px)', 'calc(-50% - 40px)', '-50%'],
                    y: [0, -40, 30, 0],
                    scale: [1, 1.2, 0.85, 1],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    )
}
