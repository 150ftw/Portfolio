import { useState } from 'react'

export default function GlitchText({
    children,
    className = '',
    style = {},
    as: Tag = 'span',
    intensity = 'medium', // 'subtle' | 'medium' | 'intense'
}) {
    const [isHovered, setIsHovered] = useState(false)

    const glitchStyles = {
        subtle: {
            '--glitch-offset': '2px',
            '--glitch-color-r': 'rgba(255, 0, 0, 0.7)',
            '--glitch-color-c': 'rgba(0, 255, 255, 0.7)',
        },
        medium: {
            '--glitch-offset': '3px',
            '--glitch-color-r': 'rgba(255, 0, 50, 0.8)',
            '--glitch-color-c': 'rgba(0, 245, 255, 0.8)',
        },
        intense: {
            '--glitch-offset': '5px',
            '--glitch-color-r': 'rgba(255, 0, 50, 1)',
            '--glitch-color-c': 'rgba(0, 245, 255, 1)',
        },
    }

    return (
        <Tag
            className={`glitch-text ${isHovered ? 'glitch-active' : ''} ${className}`}
            style={{
                ...style,
                ...glitchStyles[intensity],
                position: 'relative',
                display: 'inline-block',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-text={typeof children === 'string' ? children : ''}
        >
            {children}
        </Tag>
    )
}
