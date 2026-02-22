import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function InfiniteMarquee({
    children,
    speed = 1,
    direction = 'left', // 'left' | 'right'
    pauseOnHover = true,
    className = '',
    style = {},
    scrollAcceleration = true,
}) {
    const containerRef = useRef(null)
    const innerRef = useRef(null)
    const tweenRef = useRef(null)

    useEffect(() => {
        const inner = innerRef.current
        if (!inner) return

        // Duplicate content for seamless loop
        const contentWidth = inner.children[0]?.offsetWidth || 0

        // Create seamless GSAP timeline
        const tween = gsap.to(inner, {
            x: direction === 'left' ? -contentWidth : contentWidth,
            duration: contentWidth / (50 * speed),
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => {
                    const val = parseFloat(x)
                    if (direction === 'left') {
                        return val % contentWidth
                    }
                    return val % contentWidth
                }),
            },
        })

        tweenRef.current = tween

        // Scroll acceleration
        let scrollTriggerInstance = null
        if (scrollAcceleration) {
            scrollTriggerInstance = ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const velocity = Math.abs(self.getVelocity()) / 1000
                    const newSpeed = speed + velocity * 0.3
                    gsap.to(tween, {
                        timeScale: Math.min(newSpeed, speed * 3),
                        duration: 0.6,
                    })
                },
            })
        }

        return () => {
            tween.kill()
            if (scrollTriggerInstance) scrollTriggerInstance.kill()
        }
    }, [speed, direction, scrollAcceleration])

    const handleMouseEnter = () => {
        if (pauseOnHover && tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 })
        }
    }

    const handleMouseLeave = () => {
        if (pauseOnHover && tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: speed, duration: 0.5 })
        }
    }

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden ${className}`}
            style={{ ...style, whiteSpace: 'nowrap' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div ref={innerRef} className="inline-flex">
                <div className="inline-flex shrink-0 items-center">
                    {children}
                </div>
                <div className="inline-flex shrink-0 items-center" aria-hidden>
                    {children}
                </div>
                <div className="inline-flex shrink-0 items-center" aria-hidden>
                    {children}
                </div>
            </div>
        </div>
    )
}
