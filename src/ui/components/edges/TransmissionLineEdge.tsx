/**
 * Custom React Flow edge for transmission lines
 */

import { memo } from 'react'
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

    const stateColor = getStateColor(data?.state ?? ComponentState.Healthy)
    const utilization = data != null ? (data.currentLoad / data.capacity) * 100 : 0
    const strokeWidth = getStrokeWidth(data?.voltage ?? 400)

    return (
      <>
        <BaseEdge id={id} path={edgePath} style={{ stroke: stateColor, strokeWidth }} />
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            <div className="edge-label-content" style={{ borderColor: stateColor }}>
              <div className="edge-label-line">{data?.voltage ?? 400}kV</div>
              <div className="edge-label-line">{Math.round(utilization)}% load</div>
            </div>
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }
)

TransmissionLineEdge.displayName = 'TransmissionLineEdge'

const getStrokeWidth = (voltage: number): number => {
  if (voltage >= 400) return 4
  if (voltage >= 220) return 3
  return 2
}
