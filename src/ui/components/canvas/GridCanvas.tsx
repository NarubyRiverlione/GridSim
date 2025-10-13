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
import { getComponentSize, checkCollision, snapPointToGrid } from '@/ui/utils/placement'
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
  onNodeDragStop?: (id: string, x: number, y: number) => void
  onPlacementBlocked?: (message: string) => void
  placementBuffer?: number
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
  onNodeDragStop,
  onPlacementBlocked,
  placementBuffer = 10,
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

      // If in placement mode, treat clicking a node as an attempt to place at its location
      const isPlacementMode =
        mode === InteractionMode.AddPowerPlant ||
        mode === InteractionMode.AddCity ||
        mode === InteractionMode.AddSubstation ||
        mode === InteractionMode.AddSwitchingStation ||
        mode === InteractionMode.AddPylon

      if (isPlacementMode) {
        // Use the node's canonical location for placement attempt
        const placeX = component.location.x
        const placeY = component.location.y
        const size = getComponentSize({ type: mode, ...placementConfig })
        const collides = checkCollision(placeX, placeY, size, components, undefined, placementBuffer)
        if (collides) {
          if (typeof onPlacementBlocked === 'function') onPlacementBlocked('Placement blocked: space occupied')
          return
        }

        // If allowed, create the component via placement click
        const newComponent = onPlacementClick(placeX, placeY)
        if (newComponent !== null) onComponentAdd(newComponent)
        return
      }

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
    [
      mode,
      onComponentSelect,
      onNodeClickForLine,
      lineDrawingState,
      onLineAdd,
      placementConfig,
      onPlacementClick,
      onComponentAdd,
      components,
      onPlacementBlocked,
      placementBuffer,
    ]
  )

  // Handle edge selection
  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge): void => {
      onComponentSelect(edge.data as TransmissionLine)
    },
    [onComponentSelect]
  )

  // Handle pane click (deselect or place component)
  const handlePaneClick = useCallback(
    (event?: React.MouseEvent): void => {
      if (placementState.isPlacing && placementState.ghostPosition !== null) {
        // Compute the flow coordinates from the actual click event when available
        const clickPos = event
          ? screenToFlowPosition({ x: event.clientX, y: event.clientY })
          : placementState.ghostPosition

        // determine component size based on placement mode and config
        const getSizeForMode = (m: InteractionMode, cfg: PlacementConfig): number => {
          switch (m) {
            case InteractionMode.AddPowerPlant:
              return 80
            case InteractionMode.AddCity: {
              const citySize = cfg.citySize
              if (citySize === undefined) return 50
              return 60
            }
            case InteractionMode.AddSubstation:
              return cfg.substationType === SubstationType.Grid ? 60 : 50
            case InteractionMode.AddSwitchingStation:
              return 40
            case InteractionMode.AddPylon:
              return 30
            default:
              return 50
          }
        }

        const size = getSizeForMode(mode, placementConfig)
        const collides = checkCollision(clickPos.x, clickPos.y, size, components, undefined, 10)
        if (collides) {
          if (typeof onPlacementBlocked === 'function') {
            onPlacementBlocked('Placement blocked: space occupied')
          }
          return
        }

        if (placementState.isValidPosition) {
          // Place the component using the flow coordinates
          const newComponent = onPlacementClick(clickPos.x, clickPos.y)
          if (newComponent !== null) {
            onComponentAdd(newComponent)
          }
        }
      } else {
        // Deselect
        onComponentSelect(null)
      }
      // placementBuffer intentionally included in deps to ensure validation uses latest value
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      placementState,
      onPlacementClick,
      onComponentAdd,
      onComponentSelect,
      components,
      mode,
      placementConfig,
      onPlacementBlocked,
      screenToFlowPosition,
      placementBuffer,
    ]
  )

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
        onNodeDrag={(_event, node) => {
          if (node.id === GHOST_NODE_ID) return
          const pos = node.position as { x?: number; y?: number } | undefined
          if (!(pos && typeof pos.x === 'number' && typeof pos.y === 'number')) return

          const snapped = snapPointToGrid(pos.x, pos.y)
          const draggedComponent = components.find(c => c.id === node.id)
          if (!draggedComponent) return
          const size = getComponentSize(draggedComponent)
          const buffer = typeof placementBuffer === 'number' ? placementBuffer : 10
          const collides = checkCollision(snapped.x, snapped.y, size, components, node.id, buffer)

          // Update node data to reflect temporary invalid state while dragging
          setNodes(prev =>
            prev.map(n => {
              if (n.id !== node.id) return n
              const data = n.data as Record<string, unknown>
              return {
                ...n,
                data: { ...data, isTempInvalid: collides },
                className: collides ? 'temp-invalid' : undefined,
              }
            })
          )
        }}
        onNodeDragStop={(_event, node) => {
          if (node.id === GHOST_NODE_ID) return
          const pos = node.position as { x?: number; y?: number } | undefined
          if (!(pos && typeof pos.x === 'number' && typeof pos.y === 'number')) return

          // Snap to grid for final position
          const snapped = snapPointToGrid(pos.x, pos.y)

          // Find the component being dragged to compute its size
          const draggedComponent = components.find(c => c.id === node.id)

          if (draggedComponent) {
            const size = getComponentSize(draggedComponent)
            const collides = checkCollision(snapped.x, snapped.y, size, components, node.id, placementBuffer)
            if (collides) {
              // Revert visual position by resetting nodes to canonical component positions
              setNodes(componentNodes)
              return
            }
          }

          if (typeof onNodeDragStop === 'function') {
            onNodeDragStop(node.id, snapped.x, snapped.y)
          }
        }}
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
