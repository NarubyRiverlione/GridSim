/**
 * Custom React Flow node for power plants
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { PowerPlant } from '@/types'
import { getPlantColor, getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const PowerPlantNode = memo(({ data }: NodeProps<PowerPlant>) => {
  const plantColor = getPlantColor(data.type)
  const stateColor = getStateColor(data.state)

  return (
    <div className="custom-node plant-node" style={{ borderColor: stateColor }}>
      <Handle type="source" position={Position.Right} />
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
