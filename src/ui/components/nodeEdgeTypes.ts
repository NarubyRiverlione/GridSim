import type { NodeTypes, EdgeTypes } from 'reactflow'
import { CityNode, PowerPlantNode, SubstationNode, SwitchingStationNode, PylonNode, GhostNode } from './nodes'
import { TransmissionLineEdge } from './edges'

/*
 * Ensure node/edge type objects are stable across HMR by attaching them to globalThis.
 * Provide typed accessors (getNodeTypes / getEdgeTypes) so callers receive a stable reference.
 */

// global augmentation so TypeScript knows these globals exist on globalThis
declare global {
  var __GRIDSIM_NODE_TYPES: NodeTypes | undefined
  var __GRIDSIM_EDGE_TYPES: EdgeTypes | undefined
}

export function getNodeTypes(): NodeTypes {
  // Use nullish coalescing assignment to keep the value stable across HMR reloads.
  globalThis.__GRIDSIM_NODE_TYPES ??= {
    powerPlant: PowerPlantNode,
    city: CityNode,
    substation: SubstationNode,
    switchingStation: SwitchingStationNode,
    pylon: PylonNode,
    ghost: GhostNode,
  } as NodeTypes

  return globalThis.__GRIDSIM_NODE_TYPES
}

export function getEdgeTypes(): EdgeTypes {
  globalThis.__GRIDSIM_EDGE_TYPES ??= {
    transmission: TransmissionLineEdge,
  } as EdgeTypes

  return globalThis.__GRIDSIM_EDGE_TYPES
}
