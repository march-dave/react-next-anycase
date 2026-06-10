import React from 'react'

const normalizeChildren = (children) => React.Children.toArray(children).filter(Boolean)

const getChartSize = (width, height) => {
  const resolvedWidth = typeof width === 'number' ? width : 320
  const resolvedHeight = typeof height === 'number' ? height : 180
  return { resolvedWidth, resolvedHeight }
}

const getDisplayName = (child) => child?.type?.displayName || child?.type?.name || child?.type

const getNumericSeries = (data, series) => {
  const values = series.flatMap((item) => data.map((entry) => Number(entry[item.props.dataKey])).filter(Number.isFinite))
  return values.length ? values : [0, 1]
}

const createScale = (data, series, width, height, padding) => {
  const values = getNumericSeries(data, series)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1

  return (entry, index, dataKey) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * (width - padding.left - padding.right)
    const y =
      height -
      padding.bottom -
      ((Number(entry[dataKey]) - minValue) / range) * (height - padding.top - padding.bottom)
    return [x, y]
  }
}

const renderPath = (data, dataKey, scale, mode = 'line') => {
  const points = data.map((entry, index) => scale(entry, index, dataKey))
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ')

  if (mode === 'area') {
    const bottomY = 180 - 24
    return [
      `M ${points[0]?.[0] ?? 36} ${bottomY}`,
      ...points.map((point) => `L ${point[0]} ${point[1]}`),
      `L ${points[points.length - 1]?.[0] ?? 296} ${bottomY}`,
      'Z',
    ].join(' ')
  }

  return linePath
}

function ChartBase({ data = [], children, width, height, margin = {}, chartType = 'area' }) {
  const chartChildren = normalizeChildren(children)
  const defs = chartChildren.filter((child) => getDisplayName(child) === 'defs' || getDisplayName(child) === 'Defs')
  const grid = chartChildren.find((child) => getDisplayName(child) === 'CartesianGrid')
  const xAxis = chartChildren.find((child) => getDisplayName(child) === 'XAxis')
  const yAxis = chartChildren.find((child) => getDisplayName(child) === 'YAxis')
  const series = chartChildren.filter((child) => ['Area', 'Line'].includes(getDisplayName(child)))
  const { resolvedWidth, resolvedHeight } = getChartSize(width, height)
  const padding = {
    top: 14 + (margin.top || 0),
    right: 18 + (margin.right || 0),
    bottom: xAxis ? 24 + (margin.bottom || 0) : 14 + (margin.bottom || 0),
    left: yAxis ? 36 + Math.max(margin.left || 0, 0) : 14 + Math.max(margin.left || 0, 0),
  }
  const scale = createScale(data, series, resolvedWidth, resolvedHeight, padding)
  const xKey = xAxis?.props?.dataKey
  const gridStroke = grid?.props?.stroke || 'rgba(148,163,184,0.18)'
  const axisStroke = xAxis?.props?.stroke || yAxis?.props?.stroke || '#94a3b8'
  const axisFontSize = xAxis?.props?.fontSize || yAxis?.props?.fontSize || 10
  const firstSeriesKey = series[0]?.props?.dataKey
  const values = firstSeriesKey ? data.map((entry) => Number(entry[firstSeriesKey])).filter(Number.isFinite) : []
  const minValue = values.length ? Math.min(...values) : 0
  const maxValue = values.length ? Math.max(...values) : 1
  const yTicks = [maxValue, (maxValue + minValue) / 2, minValue]
  const tickFormatter = yAxis?.props?.tickFormatter

  return (
    <svg viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`} className="h-full w-full" role="img" aria-label={`${chartType} chart`}>
      {defs}
      {grid ? (
        <g opacity="0.9">
          {[0, 1, 2, 3].map((index) => {
            const y = padding.top + (index / 3) * (resolvedHeight - padding.top - padding.bottom)
            return <line key={`h-${index}`} x1={padding.left} x2={resolvedWidth - padding.right} y1={y} y2={y} stroke={gridStroke} strokeDasharray={grid.props.strokeDasharray} />
          })}
          {data.map((entry, index) => {
            const [x] = scale(entry, index, series[0]?.props?.dataKey)
            return <line key={`v-${index}`} x1={x} x2={x} y1={padding.top} y2={resolvedHeight - padding.bottom} stroke={gridStroke} strokeDasharray={grid.props.strokeDasharray} />
          })}
        </g>
      ) : null}
      {series.map((item) => {
        const name = getDisplayName(item)
        const dataKey = item.props.dataKey
        const stroke = item.props.stroke || '#6366f1'
        const fill = item.props.fill || 'rgba(99,102,241,0.25)'
        const strokeWidth = item.props.strokeWidth || 2
        const linePath = renderPath(data, dataKey, scale, 'line')
        const points = data.map((entry, index) => scale(entry, index, dataKey))
        const areaPath = [
          `M ${points[0]?.[0] ?? padding.left} ${resolvedHeight - padding.bottom}`,
          ...points.map((point) => `L ${point[0]} ${point[1]}`),
          `L ${points[points.length - 1]?.[0] ?? resolvedWidth - padding.right} ${resolvedHeight - padding.bottom}`,
          'Z',
        ].join(' ')

        return (
          <g key={`${name}-${dataKey}`}>
            {name === 'Area' ? <path d={areaPath} fill={fill} stroke="none" /> : null}
            <path d={linePath} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            {name === 'Line' && item.props.dot
              ? points.map(([x, y], index) => <circle key={`${dataKey}-${index}`} cx={x} cy={y} r={item.props.dot.r || 3} fill={stroke} />)
              : null}
          </g>
        )
      })}
      {xAxis ? (
        <g>
          <line x1={padding.left} x2={resolvedWidth - padding.right} y1={resolvedHeight - padding.bottom} y2={resolvedHeight - padding.bottom} stroke={axisStroke} opacity="0.35" />
          {data.map((entry, index) => {
            if (data.length > 8 && index % 2 !== 0) return null
            const [x] = scale(entry, index, series[0]?.props?.dataKey)
            return (
              <text key={`x-${index}`} x={x} y={resolvedHeight - 6} textAnchor="middle" fill={xAxis.props.stroke || axisStroke} fontSize={axisFontSize}>
                {xKey ? entry[xKey] : index + 1}
              </text>
            )
          })}
        </g>
      ) : null}
      {yAxis ? (
        <g>
          <line x1={padding.left} x2={padding.left} y1={padding.top} y2={resolvedHeight - padding.bottom} stroke={axisStroke} opacity="0.35" />
          {yTicks.map((value, index) => {
            const y = padding.top + (index / 2) * (resolvedHeight - padding.top - padding.bottom)
            const label = tickFormatter ? tickFormatter(Math.round(value)) : Math.round(value)
            return (
              <text key={`y-${index}`} x={padding.left - 8} y={y + 3} textAnchor="end" fill={yAxis.props.stroke || axisStroke} fontSize={axisFontSize}>
                {label}
              </text>
            )
          })}
        </g>
      ) : null}
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

export function AreaChart(props) {
  return <ChartBase {...props} chartType="area" />
}

export function ComposedChart(props) {
  return <ChartBase {...props} chartType="composed" />
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

CartesianGrid.displayName = 'CartesianGrid'

export function XAxis() {
  return null
}

XAxis.displayName = 'XAxis'

export function YAxis() {
  return null
}

YAxis.displayName = 'YAxis'

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
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
}
