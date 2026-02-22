/**
 * Scroll-Driven Reveal Section
 *
 * GSAP ScrollTrigger-powered scroll animations:
 * - Pin sections during scroll
 * - Parallax depth layers
 * - Progress-based reveals
 *
 * Used by: Apple (product pages), Nike, Linear
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollRevealSection({ children, className = '', parallax = false, pinDuration = 0 }) {
    const sectionRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const content = contentRef.current
        if (!section || !content) return

        const ctx = gsap.context(() => {
            // Base reveal animation
            const items = content.querySelectorAll('[data-scroll-reveal]')
            items.forEach((item, i) => {
                const direction = item.dataset.scrollReveal || 'up'
                const delay = parseFloat(item.dataset.scrollDelay || 0)

                const from = {
                    opacity: 0,
                    y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
                    x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
                    scale: direction === 'scale' ? 0.8 : 1,
                    filter: 'blur(8px)',
                }

                gsap.from(item, {
                    ...from,
                    duration: 1,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        end: 'top 20%',
                        toggleActions: 'play none none reverse',
                    },
                })
            })

            // Parallax layers
            if (parallax) {
                const layers = content.querySelectorAll('[data-parallax-speed]')
                layers.forEach((layer) => {
                    const speed = parseFloat(layer.dataset.parallaxSpeed || 0.5)
                    gsap.to(layer, {
                        y: -100 * speed,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    })
                })
            }

            // Pin section if pinDuration specified
            if (pinDuration > 0) {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: `+=${pinDuration}`,
                    pin: true,
                    pinSpacing: true,
                })
            }

            // Counter animations for elements with data-count-to
            const counters = content.querySelectorAll('[data-count-to]')
            counters.forEach((counter) => {
                const target = parseInt(counter.dataset.countTo, 10)
                const suffix = counter.dataset.countSuffix || ''

                gsap.from(counter, {
                    textContent: 0,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: counter,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                    onUpdate: function () {
                        counter.textContent = Math.ceil(parseFloat(counter.textContent)) + suffix
                    },
                })
            })
        }, section)

        return () => ctx.revert()
    }, [parallax, pinDuration])

    return (
        <section ref={sectionRef} className={className}>
            <div ref={contentRef}>
                {children}
            </div>
        </section>
    )
}
