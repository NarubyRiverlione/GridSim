/**
 * Custom React Flow edge for transmission lines
 */

import { memo, useState, useCallback, useRef } from 'react'
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getStraightPath } from 'reactflow'
import { ComponentState, type TransmissionLine } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import './EdgeStyles.css'

export const TransmissionLineEdge = memo(
  ({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps<TransmissionLine>) => {
    const [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    })

    const voltage = data?.voltage ?? 400
    const stateColor = getStateColor(data?.state ?? ComponentState.Healthy)
    const voltageColor = getVoltageColor(voltage)
    const utilization = data != null ? (data.currentLoad / data.capacity) * 100 : 0
    const strokeWidth = getStrokeWidth(voltage)

    // Use voltage color normally, state color only for failures/issues
    const strokeColor =
      data?.state === ComponentState.Healthy || data?.state === ComponentState.Stressed ? voltageColor : stateColor

    // hover state controls label visibility
    const [hovered, setHovered] = useState(false)
    const renderCount = useRef(0)
    renderCount.current += 1
    // Debug: log each render to help diagnose unnecessary re-renders
    // Can be observed in browser console: TransmissionLineEdge render <id> count=<n>
    console.debug(`TransmissionLineEdge render ${id} count=${renderCount.current}`)

    const onEnter = useCallback(() => setHovered(true), [])
    const onLeave = useCallback(() => setHovered(false), [])

    // Show labels when hovered or when data.alwaysShowLabels is true
    const shouldShowLabel: boolean = ((): boolean => {
      if (hovered) return true
      if (data && typeof data === 'object' && 'alwaysShowLabels' in (data as object)) {
        const d = data as unknown as Record<string, unknown>
        return Boolean(d['alwaysShowLabels'])
      }
      return false
    })()

    return (
      <g className="react-flow__edge" data-type="transmission-line" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <BaseEdge id={id} path={edgePath} style={{ stroke: strokeColor, strokeWidth }} />
        <EdgeLabelRenderer>
          {shouldShowLabel && (
            <div
              className="edge-label"
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              }}
            >
              <div className="edge-label-content" style={{ borderColor: voltageColor }}>
                <div className="edge-label-line">{voltage}kV</div>
                <div className="edge-label-line">{Math.round(utilization)}% load</div>
              </div>
            </div>
          )}
        </EdgeLabelRenderer>
      </g>
    )
  }
)

TransmissionLineEdge.displayName = 'TransmissionLineEdge'

const getStrokeWidth = (voltage: number): number => {
  if (voltage >= 400) return 4
  if (voltage >= 220) return 3
  return 2
}

const getVoltageColor = (voltage: number): string => {
  if (voltage >= 400) return '#dc2626' // Red for 400kV
  if (voltage >= 220) return '#2563eb' // Blue for 220kV
  return '#10b981' // Green for 110kV
}
