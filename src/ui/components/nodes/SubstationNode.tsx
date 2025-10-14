/**
 * Custom React Flow node for substations
 */

import { memo } from 'react'
import { Handle, type NodeProps } from 'reactflow'
import { SubstationType, type Substation, type TransmissionLine } from '@/types'
import { getStateColor } from '@/ui/utils/colors'
import { getHandleAvailability } from '@/utils/connectionRules'
import './NodeStyles.css'

interface SubstationNodeData extends Substation {
  transmissionLines: TransmissionLine[]
}

export const SubstationNode = memo(({ data }: NodeProps<SubstationNodeData>) => {
  const stateColor = getStateColor(data.state)
  const utilizationPercentage = Math.round((data.currentLoad / data.capacity) * 100)
  const handles = getHandleAvailability(data, data.transmissionLines)

  return (
    <div className="custom-node substation-node" style={{ borderColor: stateColor }}>
      {handles.map(handle => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          isConnectable={handle.enabled}
          className={handle.enabled ? 'handle-enabled' : 'handle-disabled'}
        />
      ))}
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
