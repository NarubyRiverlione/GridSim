/**
 * Ghost node component for placement preview
 */

import React from 'react'
import type { NodeProps } from 'reactflow'
import './NodeStyles.css'

interface GhostNodeData {
  isValid: boolean
  size: number
  label: string
}

export const GhostNode = ({ data }: NodeProps<GhostNodeData>): React.ReactElement => {
  const { isValid, size, label } = data

  return (
    <div
      className={`ghost-node ${isValid ? 'valid' : 'invalid'}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div className="ghost-node-label">{label}</div>
    </div>
  )
}
