import * as React from "react"

interface GaugeProps extends React.SVGProps<SVGSVGElement> {
  value: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  variant?: "default" | "success" | "warning" | "danger"
  label?: string
}

const sizeMap = {
  sm: {
    width: 80,
    height: 40,
    fontSize: 20,
  },
  md: {
    width: 120,
    height: 60,
    fontSize: 24,
  },
  lg: {
    width: 160,
    height: 80,
    fontSize: 30,
  },
}

const variantMap = {
  default: {
    color: "#0ea5e9", // sky-500
    background: "#e0f2fe", // sky-100
  },
  success: {
    color: "#22c55e", // green-500
    background: "#dcfce7", // green-100
  },
  warning: {
    color: "#eab308", // yellow-500
    background: "#fef9c3", // yellow-100
  },
  danger: {
    color: "#ef4444", // red-500
    background: "#fee2e2", // red-100
  },
}

export function Gauge({
  value,
  size = "md",
  showValue = true,
  variant = "default",
  label,
  className,
  ...props
}: GaugeProps) {
  const { width, height, fontSize } = sizeMap[size]
  const { color, background } = variantMap[variant]

  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value))
  
  // Calculate the arc path
  const startAngle = -90
  const endAngle = startAngle + (normalizedValue * 180) / 100

  const startPoint = polarToCartesian(width / 2, height, width / 2, startAngle)
  const endPoint = polarToCartesian(width / 2, height, width / 2, endAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  const pathData = [
    "M", startPoint.x, startPoint.y,
    "A", width / 2, width / 2, 0, largeArcFlag, 1, endPoint.x, endPoint.y
  ].join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      {...props}
    >
      {/* Background arc */}
      <path
        d={`M ${width * 0.1} ${height} A ${width * 0.4} ${width * 0.4} 0 0 1 ${width * 0.9} ${height}`}
        fill="none"
        stroke={background}
        strokeWidth={width * 0.1}
        strokeLinecap="round"
      />

      {/* Value arc */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={width * 0.1}
        strokeLinecap="round"
      />

      {/* Value text */}
      {showValue && (
        <text
          x="50%"
          y="100%"
          textAnchor="middle"
          fill="currentColor"
          fontSize={fontSize}
          fontWeight="bold"
          dy="-0.25em"
        >
          {Math.round(normalizedValue)}%
        </text>
      )}

      {/* Label text */}
      {label && (
        <text
          x="50%"
          y="10%"
          textAnchor="middle"
          fill="currentColor"
          fontSize={fontSize * 0.8}
          fontWeight="normal"
          dy="-0.25em"
        >
          {label}
        </text>
      )}
    </svg>
  )
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
