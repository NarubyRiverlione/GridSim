/**
 * Custom React Flow node for substations
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Substation } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const SubstationNode = memo(({ data }: NodeProps<Substation>) => {
  const stateColor = getStateColor(data.state)
  const utilizationPercentage = Math.round((data.currentLoad / data.capacity) * 100)

  return (
    <div className="custom-node substation-node" style={{ borderColor: stateColor }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="node-icon" style={{ backgroundColor: '#f59e0b' }}>
        <span className="icon-text">⚙️</span>
      </div>
      <div className="node-content">
        <div className="node-title">Substation</div>
        <div className="node-info">
          {data.voltageIn}kV → {data.voltageOut}kV
        </div>
        <div className="node-info">
          {data.currentLoad} / {data.capacity} MVA
        </div>
        <div className="node-info">{utilizationPercentage}% load</div>
      </div>
    </div>
  )
})

SubstationNode.displayName = 'SubstationNode'
