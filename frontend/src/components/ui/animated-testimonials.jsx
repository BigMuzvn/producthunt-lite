import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AnimatedTestimonials({ testimonials = [], autoplay = true }) {
  const [active, setActive] = useState(0)

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return
    const interval = setInterval(handleNext, 6000)
    return () => clearInterval(interval)
  }, [autoplay, handleNext, testimonials.length])

  if (!testimonials || testimonials.length === 0) return null

  const randomRotate = (index) => {
    const rotations = [-4, 5, -6, 4, -3, 6]
    return rotations[index % rotations.length]
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>
        {/* Left Column: Stacked Image Cards */}
        <div style={{ position: "relative", height: 380, width: "100%", maxWidth: 420, margin: "0 auto" }}>
          <AnimatePresence>
            {testimonials.map((testimonial, index) => {
              const isActive = index === active
              return (
                <motion.div
                  key={testimonial.src + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotate(index),
                    z: -100,
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1 : 0.92,
                    rotate: isActive ? 0 : randomRotate(index),
                    zIndex: isActive ? 20 : testimonials.length + 2 - index,
                    y: isActive ? [0, -4, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotate(index),
                    z: 100,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: isActive
                      ? "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25)"
                      : "0 10px 30px rgba(0, 0, 0, 0.5)",
                    background: "rgba(13, 19, 33, 0.8)",
                  }}
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: isActive ? "none" : "grayscale(30%) brightness(0.8)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(6, 8, 15, 0.75) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Right Column: Dynamic Testimonial Details & Quote */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 9999, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.25)", color: "#38BDF8", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 16 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Témoignage Fondateur</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
              {testimonials[active].name}
            </h3>
            <p style={{ fontSize: 14, color: "var(--cyan)", fontWeight: 600, margin: "0 0 20px" }}>
              {testimonials[active].designation}
            </p>

            {/* Animated Quote Words */}
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "#CBD5E1", fontStyle: "italic", margin: 0, minHeight: 100 }}>
              &ldquo;
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(8px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  style={{ display: "inline-block", marginRight: "0.28em" }}
                >
                  {word}
                </motion.span>
              ))}
              &rdquo;
            </p>
          </motion.div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 12 }}>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Témoignage précédent"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)"
                e.currentTarget.style.transform = "scale(1.08)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Témoignage suivant"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)"
                e.currentTarget.style.transform = "scale(1.08)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8, fontWeight: 600 }}>
              {active + 1} / {testimonials.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
