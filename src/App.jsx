import { useState, useCallback } from 'react'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import FluidCursor from './components/effects/FluidCursor'
import ParticleTrail from './components/effects/ParticleTrail'
import FilmGrain from './components/effects/FilmGrain'
import MorphingBlobs from './components/effects/MorphingBlobs'
import MatrixRain from './components/effects/MatrixRain'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Terminal from './components/Terminal'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import InfiniteMarquee from './components/ui/InfiniteMarquee'
import PerfMonitor from './components/ui/PerfMonitor'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const dividerWords = ['INNOVATE', '✦', 'CREATE', '✦', 'DESIGN', '✦', 'DEVELOP', '✦', 'DEPLOY', '✦', 'ITERATE', '✦']

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useSmoothScroll()

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      {/* Loading Screen */}
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Effect Overlays */}
      <FluidCursor />
      <ParticleTrail />
      <MorphingBlobs />
      <FilmGrain />
      <MatrixRain />
      <PerfMonitor />

      {/* Main Content */}
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: isLoaded ? 'auto' : 'none',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Terminal />

          {/* Section divider marquee */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <InfiniteMarquee speed={0.5} direction="right" className="py-4">
              {dividerWords.map((word, i) => (
                <span
                  key={i}
                  className="mx-8 text-xs font-semibold tracking-[0.3em]"
                  style={{
                    color: word === '✦' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.08)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {word}
                </span>
              ))}
            </InfiniteMarquee>
          </div>

          <About />
          <Projects />

          {/* Section divider marquee */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <InfiniteMarquee speed={0.6} direction="left" className="py-4">
              {['REACT', '◈', 'THREE.JS', '◈', 'NEXT.JS', '◈', 'TYPESCRIPT', '◈', 'NODE.JS', '◈', 'PYTHON', '◈', 'WEBGL', '◈', 'GSAP', '◈'].map((word, i) => (
                <span
                  key={i}
                  className="mx-8 text-xs font-semibold tracking-[0.3em]"
                  style={{
                    color: word === '◈' ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.06)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {word}
                </span>
              ))}
            </InfiniteMarquee>
          </div>

          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
