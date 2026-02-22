import { useEffect, useRef, useState, useCallback } from 'react'

const chars = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default function TextScramble({
    text,
    trigger = 'view', // 'view' | 'hover' | 'mount'
    speed = 30,
    delay = 0,
    className = '',
    style = {},
    as: Tag = 'span',
}) {
    const [displayText, setDisplayText] = useState('')
    const [hasTriggered, setHasTriggered] = useState(false)
    const elementRef = useRef(null)
    const frameRef = useRef(0)
    const queueRef = useRef([])
    const resolveRef = useRef(null)

    const scramble = useCallback(
        (newText) => {
            const oldText = displayText || ''
            const length = Math.max(oldText.length, newText.length)
            const queue = []
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || ''
                const to = newText[i] || ''
                const start = Math.floor(Math.random() * 40)
                const end = start + Math.floor(Math.random() * 40)
                queue.push({ from, to, start, end })
            }
            queueRef.current = queue

            cancelAnimationFrame(frameRef.current)
            let frame = 0

            const update = () => {
                let output = ''
                let complete = 0
                for (let i = 0; i < queue.length; i++) {
                    const { from, to, start, end } = queue[i]
                    if (frame >= end) {
                        complete++
                        output += to
                    } else if (frame >= start) {
                        // Random char phase
                        if (Math.random() < 0.28) {
                            queue[i].char = chars[Math.floor(Math.random() * chars.length)]
                        }
                        output += queue[i].char || chars[Math.floor(Math.random() * chars.length)]
                    } else {
                        output += from
                    }
                }
                setDisplayText(output)
                if (complete === queue.length) {
                    resolveRef.current?.()
                } else {
                    frameRef.current = requestAnimationFrame(update)
                }
                frame++
            }

            update()
        },
        [displayText],
    )

    // Mount trigger
    useEffect(() => {
        if (trigger === 'mount' && !hasTriggered) {
            const timeout = setTimeout(() => {
                scramble(text)
                setHasTriggered(true)
            }, delay)
            return () => clearTimeout(timeout)
        }
    }, [trigger, text, delay, hasTriggered, scramble])

    // View trigger (IntersectionObserver)
    useEffect(() => {
        if (trigger !== 'view') return
        const el = elementRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setTimeout(() => {
                        scramble(text)
                        setHasTriggered(true)
                    }, delay)
                }
            },
            { threshold: 0.3 },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [trigger, text, delay, hasTriggered, scramble])

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            scramble(text)
        }
    }

    return (
        <Tag
            ref={elementRef}
            className={className}
            style={{ ...style, display: 'inline-block' }}
            onMouseEnter={handleMouseEnter}
        >
            {displayText ||
                (trigger === 'mount' || trigger === 'view'
                    ? '\u00A0'.repeat(text.length)
                    : text)}
        </Tag>
    )
}
