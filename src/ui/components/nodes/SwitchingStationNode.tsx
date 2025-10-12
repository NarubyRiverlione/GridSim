/**
 * Custom React Flow node for switching stations
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { SwitchingStation } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const SwitchingStationNode = memo(({ data }: NodeProps<SwitchingStation>) => {
  const stateColor = getStateColor(data.state)
  const closedBreakers = data.breakers.filter(b => b.closed && !b.tripped).length

  return (
    <div className="custom-node switching-node" style={{ borderColor: stateColor }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="node-icon" style={{ backgroundColor: '#6366f1' }}>
        <span className="icon-text">🔀</span>
      </div>
      <div className="node-content">
        <div className="node-title">Switching Station</div>
        <div className="node-info">
          {closedBreakers} / {data.breakers.length} breakers closed
        </div>
        <div className="node-info">{data.connectedLines.length} lines</div>
      </div>
    </div>
  )
})

SwitchingStationNode.displayName = 'SwitchingStationNode'
