import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function SplitText({
    text,
    className = '',
    style = {},
    as: Tag = 'div',
    delay = 0,
    staggerDelay = 0.03,
    duration = 0.6,
    once = true,
    animation = 'rise', // 'rise' | 'fade' | 'blur' | 'rotate'
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount: 0.1 })

    const characters = useMemo(() => {
        return text.split('').map((char, i) => ({
            char: char === ' ' ? '\u00A0' : char,
            index: i,
        }))
    }, [text])

    const getAnimProps = (i) => {
        const d = delay + i * staggerDelay
        const ease = [0.215, 0.61, 0.355, 1]

        switch (animation) {
            case 'rise':
                return {
                    initial: { y: '110%', opacity: 0 },
                    animate: isInView
                        ? { y: '0%', opacity: 1, transition: { delay: d, duration, ease } }
                        : { y: '110%', opacity: 0 },
                }
            case 'fade':
                return {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: isInView
                        ? { opacity: 1, scale: 1, transition: { delay: d, duration, ease } }
                        : { opacity: 0, scale: 0.8 },
                }
            case 'blur':
                return {
                    initial: { opacity: 0, y: 20, filter: 'blur(12px)' },
                    animate: isInView
                        ? { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: d, duration: duration * 1.2, ease: [0.23, 1, 0.32, 1] } }
                        : { opacity: 0, y: 20, filter: 'blur(12px)' },
                }
            case 'rotate':
                return {
                    initial: { opacity: 0, rotateY: 90, x: -10 },
                    animate: isInView
                        ? { opacity: 1, rotateY: 0, x: 0, transition: { delay: d, duration, ease } }
                        : { opacity: 0, rotateY: 90, x: -10 },
                }
            default:
                return {
                    initial: { opacity: 0 },
                    animate: isInView
                        ? { opacity: 1, transition: { delay: d, duration } }
                        : { opacity: 0 },
                }
        }
    }

    return (
        <Tag ref={ref} className={className} style={{ ...style, display: 'flex', flexWrap: 'wrap' }}>
            {characters.map(({ char, index }) => {
                const anim = getAnimProps(index)
                return (
                    <span
                        key={index}
                        style={{
                            display: 'inline-block',
                            overflow: animation === 'rise' ? 'hidden' : 'visible',
                        }}
                    >
                        <motion.span
                            initial={anim.initial}
                            animate={anim.animate}
                            style={{
                                display: 'inline-block',
                                willChange: 'transform, opacity',
                            }}
                        >
                            {char}
                        </motion.span>
                    </span>
                )
            })}
        </Tag>
    )
}
