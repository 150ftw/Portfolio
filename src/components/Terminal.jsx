import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

const BOOT_LINES = [
    { text: 'Initializing Portfolio Kernel v2.4.0...', color: 'rgba(255,255,255,0.5)', delay: 300 },
    { text: '[OK] Loading core modules: react three.js gsap', color: '#22c55e', prefix: true, delay: 400 },
    { text: '[OK] Verifying integrity...', color: '#22c55e', prefix: true, delay: 350 },
    { text: '⟡ Connecting to creative network (∞ Tbps)...', color: 'rgba(255,255,255,0.5)', delay: 500 },
    { text: 'Connection established. Latency: 0ms', color: '#00f5ff', delay: 300 },
    { text: 'Mounting file system... Done.', color: 'rgba(255,255,255,0.5)', delay: 250 },
    {
        text: null, // special: box message
        box: true,
        title: 'Welcome to Shivam\'s Portfolio CLI v2.4.0',
        subtitle: 'Type \'help\' to see available commands.',
        delay: 400,
    },
]

const COMMANDS = {
    help: () => [
        { text: 'Available commands:', color: '#a855f7' },
        { text: '' },
        { text: '  about       — Learn about me', color: 'rgba(255,255,255,0.7)' },
        { text: '  skills      — View my tech stack', color: 'rgba(255,255,255,0.7)' },
        { text: '  projects    — Browse my projects', color: 'rgba(255,255,255,0.7)' },
        { text: '  contact     — Get in touch', color: 'rgba(255,255,255,0.7)' },
        { text: '  whoami      — Who am I?', color: 'rgba(255,255,255,0.7)' },
        { text: '  clear       — Clear the terminal', color: 'rgba(255,255,255,0.7)' },
        { text: '  theme       — Toggle theme vibes', color: 'rgba(255,255,255,0.7)' },
        { text: '  perf        — Toggle performance monitor', color: 'rgba(255,255,255,0.7)' },
        { text: '  matrix      — ???', color: 'rgba(255,255,255,0.4)' },
        { text: '' },
        { text: '  Tip: Click on section names to navigate there.', color: 'rgba(255,255,255,0.3)' },
    ],
    about: () => [
        { text: '+------------------------------------------+', color: 'rgba(255,255,255,0.2)' },
        { text: '|  Shivam Sharma                           |', color: '#00f5ff' },
        { text: '|  Full-Stack Developer & Designer         |', color: 'rgba(255,255,255,0.7)' },
        { text: '+------------------------------------------+', color: 'rgba(255,255,255,0.2)' },
        { text: '|  Full-stack developer with 2+ years of   |', color: 'rgba(255,255,255,0.5)' },
        { text: '|  experience building immersive digital    |', color: 'rgba(255,255,255,0.5)' },
        { text: '|  experiences. Passionate about AI, AR,    |', color: 'rgba(255,255,255,0.5)' },
        { text: '|  blockchain, and creative web dev.        |', color: 'rgba(255,255,255,0.5)' },
        { text: '+------------------------------------------+', color: 'rgba(255,255,255,0.2)' },
        { text: '', navigate: 'about' },
    ],
    skills: () => [
        { text: 'Tech Stack:', color: '#a855f7' },
        { text: '' },
        { text: '  Frontend   → React, Next.js, TypeScript, Tailwind CSS', color: '#00f5ff' },
        { text: '  Backend    → Node.js, Python, PostgreSQL', color: '#a855f7' },
        { text: '  Tools      → Git, Docker, AWS, Figma', color: '#ec4899' },
        { text: '  AI / ML    → OpenAI API, NLP, Cloud Computing', color: '#f59e0b' },
        { text: '  Other      → Unity, ARCore, Ethereum, Firebase', color: '#22c55e' },
        { text: '' },
        { text: '  ▸ Navigate to Skills section ↗', color: 'rgba(255,255,255,0.3)', navigate: 'skills' },
    ],
    projects: () => [
        { text: 'Featured Projects:', color: '#ec4899' },
        { text: '' },
        { text: '  01 │ CalmSphere AI          — AI mental wellness assistant', color: '#00f5ff' },
        { text: '  02 │ ArchDO                  — AR structural assistant', color: '#a855f7' },
        { text: '  03 │ Solar System Explorer   — 3D solar system simulation', color: '#ec4899' },
        { text: '  04 │ Veggie Trace            — Blockchain traceability', color: '#22c55e' },
        { text: '  05 │ AcademiQ                — Automated result management', color: '#f59e0b' },
        { text: '' },
        { text: '  ▸ Navigate to Projects section ↗', color: 'rgba(255,255,255,0.3)', navigate: 'projects' },
    ],
    contact: () => [
        { text: 'Let\'s connect!', color: '#22c55e' },
        { text: '' },
        { text: '  ✉  Email     → ss18244646@gmail.com', color: 'rgba(255,255,255,0.7)' },
        { text: '  ◈  GitHub    → github.com/150ftw', color: 'rgba(255,255,255,0.7)' },
        { text: '  ◎  LinkedIn  → linkedin.com/in/shivam-sharma-331945284', color: 'rgba(255,255,255,0.7)' },
        { text: '' },
        { text: '  ▸ Navigate to Contact section ↗', color: 'rgba(255,255,255,0.3)', navigate: 'contact' },
    ],
    whoami: () => [
        { text: 'Shivam Sharma', color: '#00f5ff' },
        { text: '' },
        { text: '  Work Profile      → Full-Stack Developer & Designer', color: 'rgba(255,255,255,0.7)' },
        { text: '  Location  → Gurugram, India 🇮🇳', color: 'rgba(255,255,255,0.7)' },
        { text: '  Status    → Available for work ✓', color: '#22c55e' },
    ],
    theme: () => [
        { text: '✦ Activating creative mode...', color: '#a855f7' },
        { text: '  Background particles → enhanced', color: 'rgba(255,255,255,0.5)' },
        { text: '  Color saturation → maxed', color: 'rgba(255,255,255,0.5)' },
        { text: '  Vibes → immaculate ✓', color: '#22c55e' },
    ],
}

export default function Terminal() {
    const termRef = useRef(null)
    const inputRef = useRef(null)
    const outputRef = useRef(null)
    const isInView = useInView(termRef, { once: true, margin: '-50px' })
    const [lines, setLines] = useState([])
    const [input, setInput] = useState('')
    const [isBooting, setIsBooting] = useState(true)
    const [cursorVisible, setCursorVisible] = useState(true)
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // Blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setCursorVisible((v) => !v), 530)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll to bottom
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [lines])

    // Boot sequence
    useEffect(() => {
        if (!isInView) return

        let timeout
        let currentIndex = 0

        const showNextLine = () => {
            if (currentIndex >= BOOT_LINES.length) {
                setIsBooting(false)
                return
            }
            const line = BOOT_LINES[currentIndex]
            setLines((prev) => [...prev, { ...line, id: `boot-${currentIndex}` }])
            currentIndex++
            timeout = setTimeout(showNextLine, line.delay)
        }

        timeout = setTimeout(showNextLine, 600)
        return () => clearTimeout(timeout)
    }, [isInView])

    const handleCommand = useCallback((cmd) => {
        const trimmed = cmd.trim().toLowerCase()
        const newLines = [{ text: `→ ~ ${cmd}`, color: 'rgba(255,255,255,0.8)', isCommand: true, id: `cmd-${Date.now()}` }]

        if (trimmed === 'clear') {
            setLines([])
            return
        }

        if (trimmed === 'perf') {
            window.dispatchEvent(new Event('toggle-perf-monitor'))
            setLines((prev) => [...prev, ...newLines,
            { text: '  ✦ Performance monitor toggled. (Shift+P also works)', color: '#22c55e', id: `perf-${Date.now()}` },
            { text: '', id: `space-${Date.now()}` },
            ])
            return
        }

        if (trimmed === 'matrix') {
            setLines((prev) => [...prev, ...newLines,
            { text: '  ⟐ Entering the Matrix...', color: '#00ff41', id: `matrix-${Date.now()}` },
            { text: '', id: `space-${Date.now()}` },
            ])
            // Simulate Konami code keystrokes
            setTimeout(() => {
                const keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
                keys.forEach((key, i) => {
                    setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', { key })), i * 30)
                })
            }, 300)
            return
        }

        if (trimmed === '') {
            setLines((prev) => [...prev, ...newLines])
            return
        }

        const handler = COMMANDS[trimmed]
        if (handler) {
            const output = handler().map((line, i) => ({
                ...line,
                id: `out-${Date.now()}-${i}`,
            }))
            setLines((prev) => [...prev, ...newLines, ...output, { text: '', id: `space-${Date.now()}` }])
        } else {
            setLines((prev) => [
                ...prev,
                ...newLines,
                { text: `  Command not found: ${trimmed}. Type 'help' for available commands.`, color: '#ef4444', id: `err-${Date.now()}` },
                { text: '', id: `space-${Date.now()}` },
            ])
        }
    }, [])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input)
            if (input.trim()) {
                setCommandHistory((prev) => [input.trim(), ...prev])
            }
            setHistoryIndex(-1)
            setInput('')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (historyIndex < commandHistory.length - 1) {
                const newIdx = historyIndex + 1
                setHistoryIndex(newIdx)
                setInput(commandHistory[newIdx])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIdx = historyIndex - 1
                setHistoryIndex(newIdx)
                setInput(commandHistory[newIdx])
            } else {
                setHistoryIndex(-1)
                setInput('')
            }
        }
    }

    const handleNavigate = (sectionId) => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus()
    }

    return (
        <div className="mx-auto w-full max-w-3xl mt-10 mb-5 px-6 sm:px-10 md:px-12 lg:px-20">
            <motion.div
                ref={termRef}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
            >
                {/* Terminal window */}
                <div
                    className="overflow-hidden rounded-xl"
                    style={{
                        background: 'rgba(15, 15, 20, 0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.03)',
                    }}
                    onClick={focusInput}
                >
                    {/* Title bar */}
                    <div
                        className="flex items-center gap-2 px-4 py-3"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
                            <div className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
                            <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
                        </div>
                        <div className="flex-1 text-center">
                            <span
                                className="text-[11px] tracking-wider"
                                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, SF Mono, monospace' }}
                            >
                                ⟩_ shivam@portfolio:~
                            </span>
                        </div>
                        <span
                            className="text-[11px]"
                            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, SF Mono, monospace' }}
                        >
                            bash
                        </span>
                    </div>

                    {/* Output area */}
                    <div
                        ref={outputRef}
                        className="overflow-y-auto p-5"
                        style={{
                            maxHeight: '360px',
                            minHeight: '200px',
                            fontFamily: 'JetBrains Mono, SF Mono, Menlo, monospace',
                            fontSize: '13px',
                            lineHeight: '1.7',
                        }}
                    >
                        {lines.map((line) => {
                            if (line.box) {
                                return (
                                    <div
                                        key={line.id}
                                        className="my-3 rounded-lg px-5 py-3"
                                        style={{
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <div style={{ color: '#22c55e', fontWeight: 600 }}>{line.title}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{line.subtitle}</div>
                                    </div>
                                )
                            }

                            return (
                                <div key={line.id} style={{ minHeight: '20px' }}>
                                    {line.navigate ? (
                                        <span
                                            className="cursor-pointer transition-colors duration-200 hover:underline"
                                            style={{ color: line.color || 'rgba(255,255,255,0.5)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleNavigate(line.navigate)
                                            }}
                                        >
                                            {line.text}
                                        </span>
                                    ) : (
                                        <span style={{ color: line.color || 'rgba(255,255,255,0.5)' }}>
                                            {line.prefix && (
                                                <span style={{ color: '#22c55e' }}>{line.text.substring(0, 4)}</span>
                                            )}
                                            {line.prefix ? line.text.substring(4) : line.text}
                                        </span>
                                    )}
                                </div>
                            )
                        })}

                        {/* Command prompt */}
                        {!isBooting && (
                            <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                                <span style={{ color: '#22c55e' }}>→</span>
                                <span style={{ color: '#00f5ff' }}>~</span>
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full border-none bg-transparent outline-none"
                                        style={{
                                            color: 'rgba(255,255,255,0.85)',
                                            fontFamily: 'JetBrains Mono, SF Mono, Menlo, monospace',
                                            fontSize: '13px',
                                            caretColor: 'transparent',
                                        }}
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {/* Custom blinking cursor */}
                                    <span
                                        className="pointer-events-none absolute top-0"
                                        style={{
                                            left: `${input.length * 7.8}px`,
                                            color: '#00f5ff',
                                            opacity: cursorVisible ? 1 : 0,
                                            transition: 'opacity 0.05s',
                                        }}
                                    >
                                        ▋
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ambient glow beneath terminal */}
                <div
                    className="pointer-events-none mx-auto h-20 w-3/4"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                        marginTop: '-10px',
                    }}
                />
            </motion.div>
        </div>
    )
}
