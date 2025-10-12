/**
 * Custom React Flow node for pylons (transmission towers)
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Pylon } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const PylonNode = memo(({ data }: NodeProps<Pylon>): React.ReactElement => {
  const stateColor = getStateColor(data.state)
  const utilization = Math.round((data.connectedLines.length / data.maxLines) * 100)
  const utilizationColor = utilization >= 100 ? '#ef4444' : utilization >= 75 ? '#f59e0b' : '#10b981'

  return (
    <div className="custom-node pylon-node" style={{ borderColor: stateColor }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="node-icon" style={{ backgroundColor: '#64748b' }}>
        <span className="icon-text">⚡</span>
      </div>
      <div className="node-content">
        <div className="node-title">Pylon</div>
        <div className="node-info" style={{ color: utilizationColor }}>
          {data.connectedLines.length} / {data.maxLines} lines
        </div>
        {data.voltageLevel !== undefined && <div className="node-info">{data.voltageLevel} kV</div>}
      </div>
    </div>
  )
})

PylonNode.displayName = 'PylonNode'
