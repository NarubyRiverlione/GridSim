/**
 * Custom React Flow node for substations
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { SubstationType, type Substation } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const SubstationNode = memo(({ data }: NodeProps<Substation>) => {
  const stateColor = getStateColor(data.state)
  const utilizationPercentage = Math.round((data.currentLoad / data.capacity) * 100)

  return (
    <div className="custom-node substation-node" style={{ borderColor: stateColor }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div
        className="node-icon"
        style={{ backgroundColor: data.substationType == SubstationType.Grid ? '#c581efff' : '#80df8dff' }}
      >
        <span className="icon-text">🏭</span>
      </div>
      <div className="node-content">
        <div className="node-title">{data.substationType == SubstationType.Grid ? 'Grid' : 'Zone'} Substation</div>
        <div className="node-info">
          {data.voltageIn}→{data.voltageOut}kV
        </div>
        <div className="node-info">
          {data.currentLoad}/{data.capacity} MW
        </div>
        <div className="node-info">{utilizationPercentage}% load</div>
      </div>
    </div>
  )
})

SubstationNode.displayName = 'SubstationNode'
