/**
 * Main grid canvas component using React Flow
 */

import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { CityNode, PowerPlantNode, SubstationNode, SwitchingStationNode } from '../nodes'
import { TransmissionLineEdge } from '../edges'
import type { Component, TransmissionLine } from '@/types'
import './CanvasStyles.css'

interface GridCanvasProps {
  components: Component[]
  transmissionLines: TransmissionLine[]
  onComponentSelect: (component: Component | TransmissionLine | null) => void
}

export const GridCanvas = ({
  components,
  transmissionLines,
  onComponentSelect,
}: GridCanvasProps): React.ReactElement => {
  // Convert components to React Flow nodes
  const initialNodes: Node[] = components.map(component => ({
    id: component.id,
    type: getNodeType(component),
    position: component.location,
    data: component,
  }))

  // Convert transmission lines to React Flow edges
  const initialEdges: Edge[] = transmissionLines.map(line => ({
    id: line.id,
    source: line.from,
    target: line.to,
    type: 'transmission',
    data: line,
  }))

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      powerPlant: PowerPlantNode,
      city: CityNode,
      substation: SubstationNode,
      switchingStation: SwitchingStationNode,
    }),
    []
  )

  // Define custom edge types
  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      transmission: TransmissionLineEdge,
    }),
    []
  )

  // Handle node selection
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node): void => {
      onComponentSelect(node.data as Component)
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

  // Handle pane click (deselect)
  const handlePaneClick = useCallback((): void => {
    onComponentSelect(null)
  }, [onComponentSelect])

  return (
    <div className="grid-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
  if ('connectedLines' in component) {
    return 'switchingStation'
  }
  return 'default'
}
