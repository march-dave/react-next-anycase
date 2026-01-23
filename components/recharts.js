import React from 'react'

const normalizeChildren = (children) => React.Children.toArray(children).filter(Boolean)

const getChartSize = (width, height) => {
  const resolvedWidth = typeof width === 'number' ? width : 320
  const resolvedHeight = typeof height === 'number' ? height : 180
  return { resolvedWidth, resolvedHeight }
}

export function ResponsiveContainer({ width = '100%', height = '100%', children }) {
  return (
    <div style={{ width, height }} className="h-full w-full">
      {children}
    </div>
  )
}

export function AreaChart({ data = [], children, width, height }) {
  const chartChildren = normalizeChildren(children)
  const defs = chartChildren.filter((child) => child.type === 'defs' || child.type === 'Defs')
  const areaChild = chartChildren.find(
    (child) => child.type?.displayName === 'Area' || child.type?.name === 'Area'
  )
  const dataKey = areaChild?.props?.dataKey
  const stroke = areaChild?.props?.stroke || '#6366f1'
  const fill = areaChild?.props?.fill || 'rgba(99,102,241,0.25)'
  const strokeWidth = areaChild?.props?.strokeWidth || 2
  const values = data.map((entry) => Number(entry[dataKey]))
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const { resolvedWidth, resolvedHeight } = getChartSize(width, height)
  const padding = 16
  const range = maxValue - minValue || 1

  const points = data.map((entry, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (resolvedWidth - padding * 2)
    const y =
      resolvedHeight -
      padding -
      ((Number(entry[dataKey]) - minValue) / range) * (resolvedHeight - padding * 2)
    return [x, y]
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`)
  const areaPath = [
    `M ${points[0]?.[0] ?? padding} ${resolvedHeight - padding}`,
    ...points.map((point) => `L ${point[0]} ${point[1]}`),
    `L ${points[points.length - 1]?.[0] ?? resolvedWidth - padding} ${resolvedHeight - padding}`,
    'Z',
  ]

  return (
    <svg viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`} className="h-full w-full">
      {defs}
      <path d={areaPath.join(' ')} fill={fill} stroke="none" />
      <path d={linePath.join(' ')} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function Area() {
  return null
}

Area.displayName = 'Area'

export function Tooltip() {
  return null
}

const polarToCartesian = (cx, cy, radius, angleInRadians) => ({
  x: cx + radius * Math.cos(angleInRadians),
  y: cy + radius * Math.sin(angleInRadians),
})

export function PieChart({ children, width, height }) {
  const chartChildren = normalizeChildren(children)
  const pieChild = chartChildren.find(
    (child) => child.type?.displayName === 'Pie' || child.type?.name === 'Pie'
  )
  if (!pieChild) {
    return null
  }
  const { data = [], innerRadius = 0, outerRadius = 70, dataKey = 'value', paddingAngle = 0 } =
    pieChild.props
  const cells = normalizeChildren(pieChild.props.children).filter(
    (child) => child.type?.displayName === 'Cell' || child.type?.name === 'Cell'
  )
  const total = data.reduce((sum, entry) => sum + Number(entry[dataKey]), 0) || 1
  const { resolvedWidth, resolvedHeight } = getChartSize(width, height)
  const cx = resolvedWidth / 2
  const cy = resolvedHeight / 2
  let startAngle = -Math.PI / 2

  const slices = data.map((entry, index) => {
    const value = Number(entry[dataKey])
    const angle = (value / total) * (Math.PI * 2)
    const endAngle = startAngle + angle
    const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
    const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
    const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle)
    const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle)
    const largeArc = angle > Math.PI ? 1 : 0
    const path = [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ')
    const fill = cells[index]?.props?.fill || '#6366f1'
    startAngle = endAngle + (paddingAngle * Math.PI) / 180
    return { path, fill }
  })

  return (
    <svg viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`} className="h-full w-full">
      {slices.map((slice, index) => (
        <path key={index} d={slice.path} fill={slice.fill} />
      ))}
    </svg>
  )
}

export function Pie() {
  return null
}

Pie.displayName = 'Pie'

export function Cell() {
  return null
}

Cell.displayName = 'Cell'

export default {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
}
