/**
 * Custom React Flow node for cities
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { City } from '@/types'
import { getCitySizeRadius, getStateColor } from '@/ui/utils/colors'
import './NodeStyles.css'

export const CityNode = memo(({ data }: NodeProps<City>) => {
  const radius = getCitySizeRadius(data.size)
  const stateColor = getStateColor(data.state)
  const deliveryPercentage = data.connected ? Math.round((data.powerReceived / data.currentDemand) * 100) : 0

  return (
    <div className="custom-node city-node" style={{ borderColor: stateColor }}>
      <Handle type="target" position={Position.Left} />
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
