import React from 'react'

const normalizeChildren = (children) => React.Children.toArray(children).filter(Boolean)

const getChartSize = (width, height) => {
  const resolvedWidth = typeof width === 'number' ? width : 640
  const resolvedHeight = typeof height === 'number' ? height : 320
  return { resolvedWidth, resolvedHeight }
}

const getDisplayName = (child) => child.type?.displayName || child.type?.name || child.type

const getSeriesChildren = (children, displayNames) =>
  normalizeChildren(children).filter((child) => displayNames.includes(getDisplayName(child)))

const getAllValues = (data, seriesChildren) => {
  const values = data.flatMap((entry) =>
    seriesChildren.map((child) => Number(entry[child.props.dataKey])).filter((value) => Number.isFinite(value))
  )
  return values.length ? values : [0]
}

const buildPoints = ({ data, dataKey, minValue, maxValue, resolvedWidth, resolvedHeight, padding }) => {
  const range = maxValue - minValue || 1

  return data.map((entry, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (resolvedWidth - padding * 2)
    const y =
      height -
      padding.bottom -
      ((Number(entry[dataKey]) - minValue) / range) * (height - padding.top - padding.bottom)
    return [x, y]
  })
}

const renderChart = ({ children, data, width, height, defaultHeight = 320 }) => {
  const chartChildren = normalizeChildren(children)
  const defs = chartChildren.filter((child) => getDisplayName(child) === 'defs')
  const seriesChildren = getSeriesChildren(chartChildren, ['Area', 'Line'])
  const values = getAllValues(data, seriesChildren)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const { resolvedWidth, resolvedHeight } = getChartSize(width, height ?? defaultHeight)
  const padding = 28

  return (
    <svg viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`} className="h-full w-full" role="img">
      {defs}
      <g opacity="0.45">
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            x2={resolvedWidth - padding}
            y1={padding + (resolvedHeight - padding * 2) * ratio}
            y2={padding + (resolvedHeight - padding * 2) * ratio}
            stroke="rgba(148, 163, 184, 0.24)"
            strokeDasharray="4 4"
          />
        ))}
      </g>
      {seriesChildren.map((child, index) => {
        const { dataKey, stroke = '#6366f1', fill = 'rgba(99,102,241,0.25)', strokeWidth = 2 } = child.props
        const points = buildPoints({ data, dataKey, minValue, maxValue, resolvedWidth, resolvedHeight, padding })
        const linePath = points.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`)
        const isArea = getDisplayName(child) === 'Area'
        const areaPath = [
          `M ${points[0]?.[0] ?? padding} ${resolvedHeight - padding}`,
          ...points.map((point) => `L ${point[0]} ${point[1]}`),
          `L ${points[points.length - 1]?.[0] ?? resolvedWidth - padding} ${resolvedHeight - padding}`,
          'Z',
        ]

        return (
          <g key={`${dataKey}-${index}`}>
            {isArea ? <path d={areaPath.join(' ')} fill={fill} stroke="none" /> : null}
            <path d={linePath.join(' ')} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        )
      })}
    </svg>
  )
}

export function ResponsiveContainer({ width = '100%', height = '100%', children }) {
  return (
    <div style={{ width, height }} className="h-full w-full">
      {children}
    </div>
  )
}

export function AreaChart({ data = [], children, width, height }) {
  return renderChart({ children, data, width, height })
}

export function ComposedChart({ data = [], children, width, height }) {
  return renderChart({ children, data, width, height })
}

export function Area() {
  return null
}

Area.displayName = 'Area'

export function Line() {
  return null
}

Line.displayName = 'Line'

export function CartesianGrid() {
  return null
}

export function XAxis() {
  return null
}

export function YAxis() {
  return null
}

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
  ComposedChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
}
