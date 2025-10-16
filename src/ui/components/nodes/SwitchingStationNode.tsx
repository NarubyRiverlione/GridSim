/**
 * Custom React Flow node for switching stations
 */

import { memo } from 'react'
import { Handle, type NodeProps } from 'reactflow'
import type { SwitchingStation, TransmissionLine } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import { getHandleAvailability } from '@/utils/connectionRules'
import './NodeStyles.css'

interface SwitchingStationNodeData extends SwitchingStation {
  transmissionLines: TransmissionLine[]
}

export const SwitchingStationNode = memo(({ data }: NodeProps<SwitchingStationNodeData>) => {
  const stateColor = getStateColor(data.state)
  const closedBreakers = data.breakers.filter(b => b.closed && !b.tripped).length
  const handles = getHandleAvailability(data, data.transmissionLines)

  return (
    <div className="custom-node switching-node" style={{ borderColor: stateColor }}>
      {handles.map(handle => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          isConnectable={handle.enabled}
          className={handle.enabled ? 'handle-enabled' : 'handle-disabled'}
        />
      ))}
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
