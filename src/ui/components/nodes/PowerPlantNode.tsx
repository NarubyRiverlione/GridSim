/**
 * Custom React Flow node for power plants
 */

import { memo } from 'react'
import { Handle, type NodeProps } from 'reactflow'
import type { PowerPlant, TransmissionLine } from '@/types'
import { getPlantColor, getStateColor } from '@/ui/utils/colors'
import { getHandleAvailability } from '@/utils/connectionRules'
import './NodeStyles.css'

interface PowerPlantNodeData extends PowerPlant {
  transmissionLines: TransmissionLine[]
}

export const PowerPlantNode = memo(({ data }: NodeProps<PowerPlantNodeData>) => {
  const plantColor = getPlantColor(data.type)
  const stateColor = getStateColor(data.state)
  const handles = getHandleAvailability(data, data.transmissionLines)

  return (
    <div className="custom-node plant-node" style={{ borderColor: stateColor }}>
      {handles.map(handle => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          isConnectable={handle.enabled}
          className={`${handle.enabled ? 'handle-enabled' : 'handle-disabled'} ${handle.type === 'source' ? 'handle-source' : 'handle-target'}`}
        />
      ))}
      <div className="node-icon" style={{ backgroundColor: plantColor }}>
        <span className="icon-text">⚡</span>
      </div>
      <div className="node-content">
        <div className="node-title">{data.type}</div>
        <div className="node-info">
          {data.currentOutput} / {data.capacity} MW
        </div>
        <div className="node-info">{Math.round((data.currentOutput / data.capacity) * 100)}% utilization</div>
      </div>
    </div>
  )
})

PowerPlantNode.displayName = 'PowerPlantNode'
