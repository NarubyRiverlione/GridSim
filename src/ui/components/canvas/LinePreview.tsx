/**
 * Line preview component for transmission line drawing
 */

import React from 'react'
import type { LineDrawingState } from '@/ui/hooks/useLinePlacement'

interface LinePreviewProps {
  lineDrawingState: LineDrawingState
}

export const LinePreview = ({ lineDrawingState }: LinePreviewProps): React.ReactElement | null => {
  if (
    !lineDrawingState.isDrawing ||
    lineDrawingState.sourceNode === null ||
    lineDrawingState.previewPosition === null
  ) {
    return null
  }

  const { sourceNode, previewPosition, errorMessage } = lineDrawingState

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <line
          x1={sourceNode.location.x}
          y1={sourceNode.location.y}
          x2={previewPosition.x}
          y2={previewPosition.y}
          stroke={errorMessage !== null ? '#ef4444' : '#3b82f6'}
          strokeWidth={3}
          strokeDasharray="5,5"
          opacity={0.6}
        />
        <circle cx={sourceNode.location.x} cy={sourceNode.location.y} r={8} fill="#3b82f6" opacity={0.8} />
      </svg>
      {errorMessage !== null && (
        <div
          style={{
            position: 'absolute',
            top: `${previewPosition.y + 20}px`,
            left: `${previewPosition.x + 20}px`,
            background: '#ef4444',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            zIndex: 1001,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {errorMessage}
        </div>
      )}
    </>
  )
}
