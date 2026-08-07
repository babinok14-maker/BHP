import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import './Hero.css'
import homepagevedio from '../assets/homepage-loop-17s.webm'

const SLIDES = [
  {
    id: 1,
    image: 'https://www.bhp.com/-/media/project/bhp1ip/bhp1ip-en/fl-home/fl-hero_1.jpg'
  },
  {
    id: 2,
    image: 'https://www.bhp.com/-/media/project/bhp1ip/bhp1ip-en/fl-home/fl-hero-2.jpg'
  },
]

export default function Hero() {
  // State 0 tracks the initially playing video block
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)
  const videoRef = useRef(null) // 👇 Added ref hook to control local video playback states

  // Handles playing and resetting the video track element cleanly when active index state returns back to 0
  useEffect(() => {
    if (active === 0 && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch((err) => console.log("Video play interrupted:", err))
    }
  }, [active])

  // Iterates the complete loop context sequence: Video (0) -> Slide 1 -> Slide 2 -> Video (0)
  useEffect(() => {
    if (active > 0) {
      timerRef.current = setInterval(() => {
        setActive((prevActive) => {
          // If we are currently on the last image slide item (id: 2), return the layout back to the video state (0)
          if (prevActive === SLIDES[SLIDES.length - 1].id) {
            return 0
          }
          // Otherwise, step forward through the image slides sequentially
          const currentIndex = SLIDES.findIndex((slide) => slide.id === prevActive)
          return SLIDES[currentIndex + 1].id
        })
      }, 5000) // Advances image frames every 5 seconds
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active])

  // Triggers slide transitions immediately upon complete video layout conclusion
  const handleVideoEnded = () => {
    setActive(1)
  }

  // Intercepts navigation dots to suspend active background layout timers
  const handleDotClick = (slideId) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setActive(slideId)
  }

  return (
    <section className="hero" id="top">
      <div className="hero__intro container">
        <div className="hero__copy">
          <h1>Building what's next is what BHP does best.</h1>
          <p className="hero__subtitle">Resources that make the future possible.</p>
        </div>
        <a href="#positioning" className="eyebrow-link hero__cta">
         <span>Find out more</span>  <ArrowRight size={16} />
        </a>
      </div>

      <div className="hero__media">
        {/* Bound the videoRef element hook tracker to control background file looping systems */}
        <video
          ref={videoRef}
          className={`hero__video ${active === 0 ? 'is-active' : ''}`}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          width="1280"
          height="720"
        >
          <source
            src={homepagevedio}
            type="video/mp4"
          />
        </video>

        {SLIDES.map((slide) => (
          <img
            key={slide.id}
            src={slide.image || slide.vedio}
            alt={`Hero slide ${slide.id}`}
            className={`hero__image ${active === slide.id ? 'is-active' : ''}`}
            width="1920"
            height="1080"
          />
        ))}

        <button className="hero__scroll" aria-label="Scroll down">
          <ChevronDown size={22} />
        </button>

        <div className="hero__dots" role="tablist" aria-label="Hero slides">
          {/* Dedicated navigation trigger point for video frame 0 */}
          <button
            role="tab"
            aria-selected={active === 0}
            aria-label="Video Slide"
            className={`hero__dot ${active === 0 ? 'is-active' : ''}`}
            onClick={() => handleDotClick(0)}
          />
          {SLIDES.map((slide) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={active === slide.id}
              aria-label={`Slide ${slide.id}`}
              className={`hero__dot ${active === slide.id ? 'is-active' : ''}`}
              onClick={() => handleDotClick(slide.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
