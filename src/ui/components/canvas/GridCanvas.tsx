/**
 * Main grid canvas component using React Flow
 */

import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Component, TransmissionLine, InteractionMode, SubstationType } from '@/types'
import type { PlacementState, PlacementConfig } from '@/ui/hooks/useComponentPlacement'
import type { LineDrawingState } from '@/ui/hooks/useLinePlacement'
import { getComponentSize } from '@/ui/utils/placement'
import './CanvasStyles.css'
import { getNodeTypes, getEdgeTypes } from '../nodeEdgeTypes'

// Ensure nodeTypes and edgeTypes are stable by defining them at module scope
const stableNodeTypes = getNodeTypes()
const stableEdgeTypes = getEdgeTypes()

interface GridCanvasProps {
  components: Component[]
  transmissionLines: TransmissionLine[]
  onComponentSelect: (component: Component | TransmissionLine | null) => void
  mode: InteractionMode
  placementState: PlacementState
  placementConfig: PlacementConfig
  onMouseMove: (x: number, y: number) => void
  onPlacementClick: (x: number, y: number) => Component | null
  onComponentAdd: (component: Component) => void
  lineDrawingState: LineDrawingState
  onNodeClickForLine: (node: Component) => void
  onMouseMoveForLine: (x: number, y: number) => void
  onLineAdd: (source: Component, target: Component) => void
}

const GHOST_NODE_ID = 'ghost-preview-node'

export const GridCanvas = ({
  components,
  transmissionLines,
  onComponentSelect,
  mode,
  placementState,
  placementConfig,
  onMouseMove,
  onPlacementClick,
  onComponentAdd,
  lineDrawingState,
  onNodeClickForLine,
  onMouseMoveForLine,
  onLineAdd,
}: GridCanvasProps): React.ReactElement => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  // Convert components to React Flow nodes
  const componentNodes: Node[] = useMemo(
    () =>
      components.map(component => ({
        id: component.id,
        type: getNodeType(component),
        position: component.location,
        data: component,
      })),
    [components]
  )

  // Add ghost node if placing
  const allNodes = useMemo(() => {
    if (placementState.isPlacing && placementState.ghostPosition !== null) {
      const ghostNode: Node = {
        id: GHOST_NODE_ID,
        type: 'ghost',
        position: placementState.ghostPosition,
        data: {
          isValid: placementState.isValidPosition,
          size: getComponentSize({ type: mode, ...placementConfig }),
          label: getPlacementLabel(mode, placementConfig),
        },
        draggable: false,
        selectable: false,
      }
      return [...componentNodes, ghostNode]
    }
    return componentNodes
  }, [componentNodes, placementState, mode, placementConfig])

  // Convert transmission lines to React Flow edges
  const edgesData: Edge[] = useMemo(
    () =>
      transmissionLines.map(line => ({
        id: line.id,
        source: line.from,
        target: line.to,
        type: 'transmission',
        data: line,
      })),
    [transmissionLines]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(allNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData)

  // Update nodes when components or placement state changes
  useEffect(() => {
    setNodes(allNodes)
  }, [allNodes, setNodes])

  // Update edges when transmission lines change
  useEffect(() => {
    setEdges(edgesData)
  }, [edgesData, setEdges])

  // Handle node selection or line drawing
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node): void => {
      if (node.id === GHOST_NODE_ID) return

      const component = node.data as Component

      // If in line drawing mode, handle line placement
      if (mode === InteractionMode.AddTransmissionLine) {
        // If completing a line (second click), create it first
        if (lineDrawingState.isDrawing && lineDrawingState.sourceNode !== null) {
          onLineAdd(lineDrawingState.sourceNode, component)
        }

        // Then update the line drawing state
        onNodeClickForLine(component)
      } else {
        // Otherwise, select the component
        onComponentSelect(component)
      }
    },
    [mode, onComponentSelect, onNodeClickForLine, lineDrawingState, onLineAdd]
  )

  // Handle edge selection
  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge): void => {
      onComponentSelect(edge.data as TransmissionLine)
    },
    [onComponentSelect]
  )

  // Handle pane click (deselect or place component)
  const handlePaneClick = useCallback((): void => {
    if (placementState.isPlacing && placementState.isValidPosition && placementState.ghostPosition !== null) {
      // Place the component
      const newComponent = onPlacementClick(placementState.ghostPosition.x, placementState.ghostPosition.y)
      if (newComponent !== null) {
        onComponentAdd(newComponent)
      }
    } else {
      // Deselect
      onComponentSelect(null)
    }
  }, [placementState, onPlacementClick, onComponentAdd, onComponentSelect])

  // Handle mouse move for placement preview and line drawing
  const handleMouseMove = useCallback(
    (event: React.MouseEvent): void => {
      if (reactFlowWrapper.current === null) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Update placement preview
      onMouseMove(position.x, position.y)

      // Update line drawing preview
      onMouseMoveForLine(position.x, position.y)
    },
    [onMouseMove, onMouseMoveForLine, screenToFlowPosition]
  )

  return (
    <div className="grid-canvas" ref={reactFlowWrapper} onMouseMove={handleMouseMove}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={stableNodeTypes}
        edgeTypes={stableEdgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
        }}
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  )
}

// Helper function to determine node type from component
const getNodeType = (component: Component): string => {
  if ('type' in component && 'capacity' in component && 'currentOutput' in component) {
    return 'powerPlant'
  }
  if ('name' in component && 'size' in component) {
    return 'city'
  }
  if ('voltageIn' in component && 'voltageOut' in component) {
    return 'substation'
  }
  if ('maxLines' in component && !('breakers' in component)) {
    return 'pylon'
  }
  if ('connectedLines' in component && 'breakers' in component) {
    return 'switchingStation'
  }
  return 'default'
}

const getPlacementLabel = (mode: InteractionMode, config: PlacementConfig): string => {
  if (mode === InteractionMode.AddPowerPlant) {
    return config.plantType
  }
  if (mode === InteractionMode.AddCity) {
    return config.citySize
  }
  if (mode === InteractionMode.AddSubstation) {
    return config.substationType === SubstationType.Grid ? 'Grid Sub' : 'Zone Sub'
  }
  if (mode === InteractionMode.AddSwitchingStation) {
    return 'Switching'
  }
  if (mode === InteractionMode.AddPylon) {
    return 'Pylon'
  }
  return 'Component'
}
