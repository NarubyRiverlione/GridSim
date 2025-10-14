/**
 * Custom React Flow node for pylons (transmission towers)
 */

import { memo } from 'react'
import { Handle, type NodeProps } from 'reactflow'
import type { Pylon, TransmissionLine } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import { getHandleAvailability } from '@/utils/connectionRules'
import './NodeStyles.css'

interface PylonNodeData extends Pylon {
  transmissionLines: TransmissionLine[]
}

export const PylonNode = memo(({ data }: NodeProps<PylonNodeData>): React.ReactElement => {
  const stateColor = getStateColor(data.state)
  const utilization = Math.round((data.connectedLines.length / data.maxLines) * 100)
  const utilizationColor = utilization >= 100 ? '#ef4444' : utilization >= 75 ? '#f59e0b' : '#10b981'
  const handles = getHandleAvailability(data, data.transmissionLines)

  return (
    <div className="custom-node pylon-node" style={{ borderColor: stateColor }}>
      {handles.map(handle => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          isConnectable={handle.enabled}
          className={handle.enabled ? 'handle-enabled' : 'handle-disabled'}
        />
      ))}
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
