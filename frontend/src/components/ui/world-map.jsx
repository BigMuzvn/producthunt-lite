import { useRef, useMemo } from "react"
import { motion } from "framer-motion"
import DottedMap from "dotted-map"

export default function WorldMap({
  dots = [],
  lineColor = "#38BDF8",
}) {
  const svgRef = useRef(null)

  // Génération de la véritable carte du monde en nuage de points officielle Aceternity UI
  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" })
    return map.getSVG({
      radius: 0.22,
      color: "#FFFFFF40",
      shape: "circle",
      backgroundColor: "transparent",
    })
  }, [])

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (800 / 360)
    const y = (90 - lat) * (400 / 180)
    return { x, y }
  }

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2
    const midY = Math.min(start.y, end.y) - 50
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "2/1",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(0, 0, 0, 0.4)",
        maxWidth: 1050,
        margin: "0 auto",
      }}
    >
      {/* Vrai SVG Dotted Map officiel généré par dotted-map */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
          maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
        }}
        alt="world map"
        draggable={false}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
            <stop offset="10%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="90%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)
          const pathD = createCurvedPath(startPoint, endPoint)
          return (
            <g key={`path-group-${i}`}>
              {/* Ligne d'arrière-plan statique subtile */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />

              {/* Faisceau d'énergie lumineux animé */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.75"
                strokeLinecap="round"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  delay: (i * 0.3) % 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.5,
                }}
              />
            </g>
          )
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)
          return (
            <g key={`points-group-${i}`}>
              <g key={`point-start-${i}`}>
                <circle cx={startPoint.x} cy={startPoint.y} r="2.5" fill={lineColor} />
                <motion.circle
                  cx={startPoint.x}
                  cy={startPoint.y}
                  r="6"
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="1.5"
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </g>
              <g key={`point-end-${i}`}>
                <circle cx={endPoint.x} cy={endPoint.y} r="2.5" fill={lineColor} />
                <motion.circle
                  cx={endPoint.x}
                  cy={endPoint.y}
                  r="6"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="1.5"
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 0.2 }}
                />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
