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

import { Component, TransmissionLine, InteractionMode } from '@/types'
import type { PlacementState, PlacementConfig } from '@/ui/hooks/useComponentPlacement'
import type { LineDrawingState } from '@/ui/hooks/useLinePlacement'
import { getComponentSize, checkCollision, snapPointToGrid } from '@/ui/utils/placement'
import './CanvasStyles.css'
import { getNodeTypes, getEdgeTypes } from '../nodeEdgeTypes'
import {
  componentsToNodes,
  linesToEdges,
  createGhostNode,
  getSizeForMode,
  getPlacementLabel,
  isPlacementMode,
  shallowNodesEqual,
  shallowEdgesEqual,
  GHOST_NODE_ID,
} from './gridCanvasUtils'

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
  const lastMouseLog = useRef<number>(0)
  const renderCount = useRef(0)
  renderCount.current += 1
  // Debug: log GridCanvas render count
  console.debug(`GridCanvas render count=${renderCount.current}`)
  // RAF batching refs for mouse move
  const rafId = useRef<number | null>(null)
  const pendingPos = useRef<{ x: number; y: number } | null>(null)
  const placementBufferRef = useRef<number>(typeof placementBuffer === 'number' ? placementBuffer : 10)

  // keep placementBufferRef in sync
  useEffect(() => {
    placementBufferRef.current = typeof placementBuffer === 'number' ? placementBuffer : 10
  }, [placementBuffer])

  // Convert components to React Flow nodes
  const componentNodes: Node[] = useMemo(() => componentsToNodes(components, transmissionLines), [components, transmissionLines])

  // Add ghost node if placing
  const allNodes = useMemo(() => {
    // Only render the ghost preview when placementState has an explicit ghostPosition
    if (placementState.isPlacing && placementState.ghostPosition !== null) {
      const ghostPos = placementState.ghostPosition
      const size = getSizeForMode(mode, placementConfig)
      const label = getPlacementLabel(mode, placementConfig)
      const ghostNode = createGhostNode(ghostPos, placementState.isValidPosition, size, label)
      return [...componentNodes, ghostNode]
    }
    return componentNodes
  }, [componentNodes, placementState, mode, placementConfig])

  // Convert transmission lines to React Flow edges
  const edgesData: Edge[] = useMemo(() => linesToEdges(transmissionLines), [transmissionLines])

  const [nodes, setNodes, onNodesChange] = useNodesState(allNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData)
  // Keep previous values to avoid calling setNodes when nothing changed
  const prevAllNodesRef = useRef<Node[] | null>(null)

  // Update nodes when components or placement state changes, but avoid no-op updates
  useEffect(() => {
    try {
      if (prevAllNodesRef.current && shallowNodesEqual(allNodes, prevAllNodesRef.current)) {
        return
      }
    } catch {
      // fallthrough
    }
    console.debug('GridCanvas effect: setNodes called, allNodes length=', allNodes.length)
    setNodes(allNodes)
    prevAllNodesRef.current = allNodes
  }, [allNodes, setNodes])

  // Keep previous edges to avoid calling setEdges when nothing changed
  const prevEdgesRef = useRef<Edge[] | null>(null)

  // Update edges when transmission lines change, avoid no-op updates
  useEffect(() => {
    try {
      if (prevEdgesRef.current && shallowEdgesEqual(edgesData, prevEdgesRef.current)) {
        return
      }
    } catch {
      // fallthrough
    }
    console.debug('GridCanvas effect: setEdges called, edgesData length=', edgesData.length)
    setEdges(edgesData)
    prevEdgesRef.current = edgesData
  }, [edgesData, setEdges])

  // Handle node hover - show component details
  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node): void => {
      if (node.id === GHOST_NODE_ID) return

      const component = node.data as Component
      onComponentSelect(component)
    },
    [onComponentSelect]
  )

  // Handle node selection or line drawing
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node): void => {
      if (node.id === GHOST_NODE_ID) return

      const component = node.data as Component

      // If in placement mode, treat clicking a node as an attempt to place at its location
      if (isPlacementMode(mode)) {
        // Use the node's canonical location for placement attempt
        const placeX = component.location.x
        const placeY = component.location.y
        const size = getSizeForMode(mode, placementConfig)
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
      }
      // Click no longer selects in select mode - hover does that
    },
    [
      mode,
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

  // Handle edge hover - show line details
  const handleEdgeMouseEnter = useCallback(
    (_event: React.MouseEvent, edge: Edge): void => {
      onComponentSelect(edge.data as TransmissionLine)
    },
    [onComponentSelect]
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
      if (isPlacementMode(mode)) {
        // Prefer using the actual click event coordinates when available (tests click directly).
        const clickPos = event
          ? screenToFlowPosition({ x: event.clientX, y: event.clientY })
          : placementState.ghostPosition
        if (!clickPos) return

        const size = getSizeForMode(mode, placementConfig)
        const collides = checkCollision(clickPos.x, clickPos.y, size, components, undefined, placementBuffer)
        console.debug('GridCanvas.handlePaneClick: clickPos=', clickPos, 'size=', size, 'collides=', collides)
        if (collides) {
          if (typeof onPlacementBlocked === 'function') onPlacementBlocked('Placement blocked: space occupied')
          return
        }

        const newComponent = onPlacementClick(clickPos.x, clickPos.y)
        // console.log('GridCanvas.handlePaneClick: onPlacementClick returned', newComponent)
        if (newComponent !== null) onComponentAdd(newComponent)
        return
      }

      // Not in placement mode — deselect
      onComponentSelect(null)
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

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })

      // Throttled debug logging to observe mouse move frequency without flooding console
      const now = Date.now()
      if (now - lastMouseLog.current > 200) {
        console.debug(`GridCanvas mouseMove flowPos=${position.x},${position.y}`)
        lastMouseLog.current = now
      }

      // Batch placement and line-preview updates via requestAnimationFrame to avoid high-frequency state updates
      pendingPos.current = position
      rafId.current ??= window.requestAnimationFrame(() => {
        rafId.current = null
        const pos = pendingPos.current
        pendingPos.current = null
        if (!pos) return
        onMouseMove(pos.x, pos.y)
        onMouseMoveForLine(pos.x, pos.y)
      })
    },
    [onMouseMove, onMouseMoveForLine, screenToFlowPosition]
  )

  return (
    <div
      className="grid-canvas"
      data-mode={mode}
      ref={reactFlowWrapper}
      onMouseMove={handleMouseMove}
    >
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
        onNodeMouseEnter={handleNodeMouseEnter}
        onEdgeClick={handleEdgeClick}
        onEdgeMouseEnter={handleEdgeMouseEnter}
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
        {/* <MiniMap nodeStrokeWidth={3} zoomable pannable /> */}
      </ReactFlow>
    </div>
  )
}
