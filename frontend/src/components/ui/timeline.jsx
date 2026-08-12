import { useEffect, useRef, useState } from "react"
import { useScroll, useTransform, motion } from "framer-motion"

export function Timeline({ data = [] }) {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref, data])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative", padding: "40px 0" }}>
      <div ref={ref} style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingTop: index === 0 ? 0 : 64,
              paddingBottom: 24,
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            {/* Colonne Date / Titre Milestone */}
            <div style={{ position: "sticky", top: 120, zIndex: 10, display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 280 }}>
              <div
                style={{
                  height: 36,
                  width: 36,
                  position: "absolute",
                  left: 12,
                  borderRadius: "50%",
                  background: "rgba(13, 19, 33, 0.9)",
                  border: "2px solid rgba(99, 102, 241, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
                }}
              >
                <div style={{ height: 10, width: 10, borderRadius: "50%", background: "#38BDF8", boxShadow: "0 0 8px #38BDF8" }} />
              </div>
              <h3 style={{ paddingLeft: 60, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "#FFFFFF", margin: 0 }}>
                {item.title}
              </h3>
            </div>

            {/* Colonne Contenu */}
            <div style={{ position: "relative", paddingLeft: 60, width: "100%", flex: 1, minWidth: 280 }}>
              {item.content}
            </div>
          </div>
        ))}

        {/* Ligne verticale de fond */}
        <div
          style={{
            position: "absolute",
            left: 29,
            top: 0,
            bottom: 0,
            width: 2,
            background: "rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Ligne d'énergie active animée */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              position: "absolute",
              insetX: 0,
              top: 0,
              width: 2,
              background: "linear-gradient(to bottom, #38BDF8 0%, #6366F1 50%, transparent 100%)",
              boxShadow: "0 0 12px rgba(56, 189, 248, 0.8)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
