/**
 * Custom React Flow node for cities
 */

import { memo } from 'react'
import { Handle, type NodeProps } from 'reactflow'
import type { City, TransmissionLine } from '@/types'
import { getCitySizeRadius, getStateColor } from '@/ui/utils/colors'
import { getHandleAvailability } from '@/utils/connectionRules'
import './NodeStyles.css'

interface CityNodeData extends City {
  transmissionLines: TransmissionLine[]
}

export const CityNode = memo(({ data }: NodeProps<CityNodeData>) => {
  const radius = getCitySizeRadius(data.size)
  const stateColor = getStateColor(data.state)
  const deliveryPercentage = data.connected ? Math.round((data.powerReceived / data.currentDemand) * 100) : 0
  const handles = getHandleAvailability(data, data.transmissionLines)

  // Container size = icon size + padding (8px × 2) + border (2px × 2)
  const containerSize = radius * 2 + 8 * 2 + 2 * 2

  return (
    <div
      className="custom-node city-node"
      style={{
        borderColor: stateColor,
        width: `${containerSize}px`,
        height: `${containerSize}px`,
      }}
    >
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
        className="node-icon city-icon"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          backgroundColor: stateColor,
        }}
      >
        <span className="icon-text">🏙️</span>
      </div>
      <div className="node-content">
        <div className="node-title">{data.name}</div>
        <div className="node-info">{data.size}</div>
        <div className="node-info">
          {data.powerReceived} / {data.currentDemand} MW
        </div>
        {data.connected && <div className="node-info">{deliveryPercentage}% powered</div>}
        {!data.connected && <div className="node-warning">Not connected</div>}
      </div>
    </div>
  )
})

CityNode.displayName = 'CityNode'
