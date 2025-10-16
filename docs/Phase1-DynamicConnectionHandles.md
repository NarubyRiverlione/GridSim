# Phase 1 Feature: Dynamic Connection Handles

## Overview

This feature implements intelligent connection handle management for all grid components. Currently (Phase 0), all nodes display static handles regardless of connection state. In Phase 1, handles will dynamically enable/disable based on business rules and existing connections, providing clear visual feedback and preventing invalid connections.

## Business Rationale

- **Prevent invalid connections**: Block connections that exceed component capacity before line creation
- **Clear user feedback**: Visual indication of available vs occupied connection points
- **Enforce grid architecture**: Maintain the three-tier voltage cascade (400kV → 220kV → 110kV)
- **Realistic constraints**: Model real-world substation and transmission infrastructure limitations

## Connection Rules by Component Type

### 1. Power Plant

- **Connection Limit**: 1 source connection maximum
- **Handle Display**: 4 source handles visible (Right, Top, Bottom, Left positions)
- **Behavior**: Once 1 outbound connection exists, all 4 handles become disabled
- **Rationale**: Power plants output to a single grid substation in the tier-1 transmission network

### 2. Substation (Grid & Zone)

- **Connection Limit**:
  - Input side: 1 target connection maximum
  - Output side: 1 source connection maximum
- **Handle Display**:
  - Input side (Left): 4 target handles visible
  - Output side (Right): 4 source handles visible
- **Behavior**:
  - Once 1 inbound connection exists, all input handles become disabled
  - Once 1 outbound connection exists, all output handles become disabled
- **Rationale**: Substations transform voltage in a single input → single output flow (400→220 or 220→110)

### 3. Switching Station

- **Connection Limit**: 4 target connections + 4 source connections (8 total)
- **Handle Display**:
  - 4 target handles (Left, Top-Left, Bottom-Left, Back-Left)
  - 4 source handles (Right, Top-Right, Bottom-Right, Back-Right)
- **Behavior**:
  - Disable target handles when 4 inbound connections reached
  - Disable source handles when 4 outbound connections reached
- **Rationale**: Switching stations route power at the same voltage level with multiple breaker configurations

### 4. Pylon

- **Connection Limit**: 4 target connections + 4 source connections (8 total, matches `maxLines` property)
- **Handle Display**:
  - 4 target handles (Left, Top-Left, Bottom-Left, Back-Left)
  - 4 source handles (Right, Top-Right, Bottom-Right, Back-Right)
- **Behavior**:
  - Disable target handles when 4 inbound connections reached
  - Disable source handles when 4 outbound connections reached
- **Rationale**: Pylons support structural capacity for multiple transmission lines (default 4-line capacity)

### 5. City

- **Connection Limit**: 6 target connections (always available)
- **Handle Display**: 6 target handles (Left, Top-Left, Top, Bottom-Left, Bottom, Left-Center)
- **Behavior**: All 6 handles remain enabled at all times
- **Rationale**:
  - 110kV line capacity: ~300 MW per line
  - Major Metro (5173 MW base demand): requires ~10 lines at peak
  - 6 handles covers most scenarios in Phase 1
  - Future expansion to 8+ handles if needed for larger cities

## Technical Implementation

### Architecture: Separation of Concerns

**Key Principle**: Component nodes are **presentational** - they do not decide connection rules. Business logic lives in a centralized **Connection Rules Engine**.

### Files to Create

#### `src/utils/connectionRules.ts` (New)

Centralized business logic for connection validation.

```typescript
/**
 * Connection rules engine - centralized business logic for grid connections
 */

export interface ConnectionCounts {
  inbound: number
  outbound: number
}

export interface ConnectionLimits {
  maxInbound: number
  maxOutbound: number
}

/**
 * Count existing connections for a component
 */
export function getConnectionCounts(componentId: string, lines: TransmissionLine[]): ConnectionCounts

/**
 * Get connection limits for a component type
 */
export function getMaxConnections(component: Component): ConnectionLimits

/**
 * Check if a component can accept a new connection
 */
export function canAcceptConnection(
  component: Component,
  lines: TransmissionLine[],
  direction: 'source' | 'target'
): { allowed: boolean; reason?: string }

/**
 * Get available handle information for rendering
 */
export function getHandleAvailability(component: Component, lines: TransmissionLine[]): HandleInfo[]
```

### Files to Modify

#### `src/types/components.ts`

Add handle information interface:

```typescript
export interface HandleInfo {
  id: string
  position: Position // React Flow position enum
  type: 'source' | 'target'
  enabled: boolean
  connectionCount?: number
}
```

#### `src/ui/hooks/useLinePlacement.ts`

Integrate connection rules into validation:

```typescript
import { canAcceptConnection } from '@/utils/connectionRules'

const canConnectNodes = (source: Component, target: Component) => {
  // Existing validation (self-connection, city-to-city, voltage)
  // ...

  // NEW: Check connection capacity
  const sourceCheck = canAcceptConnection(source, existingLines, 'source')
  if (!sourceCheck.allowed) {
    return { valid: false, error: sourceCheck.reason }
  }

  const targetCheck = canAcceptConnection(target, existingLines, 'target')
  if (!targetCheck.allowed) {
    return { valid: false, error: targetCheck.reason }
  }

  return { valid: true }
}
```

#### `src/ui/components/canvas/gridCanvasUtils.ts`

Pass transmission line data to nodes:

```typescript
export const componentsToNodes = (components: Component[], transmissionLines: TransmissionLine[]): Node[] => {
  return components.map(component => ({
    id: component.id,
    type: getNodeType(component),
    position: component.location,
    data: {
      ...component,
      transmissionLines, // Pass line data for connection counting
    },
  }))
}
```

#### Node Components (5 files)

**`src/ui/components/nodes/PowerPlantNode.tsx`**:

```typescript
import { getHandleAvailability } from '@/utils/connectionRules'

export const PowerPlantNode = memo(({ data }: NodeProps<PowerPlant>) => {
  const handles = getHandleAvailability(data, data.transmissionLines)
  const hasConnection = handles.some(h => !h.enabled)

  return (
    <div className="custom-node plant-node">
      {handles.map(handle => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          isConnectable={handle.enabled}
          className={handle.enabled ? 'handle-enabled' : 'handle-disabled'}
        />
      ))}
      {/* Node content */}
    </div>
  )
})
```

Similar patterns for:

- **`SubstationNode.tsx`**: 4 input + 4 output handles, 1 each max
- **`SwitchingStationNode.tsx`**: 4 input + 4 output handles, 4 each max
- **`PylonNode.tsx`**: 4 input + 4 output handles, 4 each max
- **`CityNode.tsx`**: 6 input handles, all always enabled

#### `src/ui/components/nodes/NodeStyles.css`

Add handle state styling:

```css
.handle-enabled {
  opacity: 1;
  cursor: crosshair;
}

.handle-disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background-color: #6b7280 !important;
}
```

## Validation Rules

### Pre-Connection Validation (in `useLinePlacement.canConnectNodes`)

1. Source component has available outbound capacity
2. Target component has available inbound capacity
3. Voltage compatibility (existing rule)
4. No duplicate connections (existing rule)
5. No self-connections (existing rule)

### Error Messages

- `"Power plant already connected (1/1 source used)"`
- `"Substation input occupied (1/1 target used)"`
- `"Substation output occupied (1/1 source used)"`
- `"Switching station at capacity (4/4 targets used)"`
- `"Pylon at capacity (4/4 lines connected)"`
- `"City at capacity (6/6 lines connected)"`

## Visual Feedback

### Handle States

1. **Enabled** (available for connection):
   - Full opacity (100%)
   - Standard handle color
   - Cursor: `crosshair`
   - Hover: slight scale/glow effect

2. **Disabled** (capacity reached):
   - Reduced opacity (30%)
   - Gray color (`#6b7280`)
   - Cursor: `not-allowed`
   - No hover effects

### Connection Count Display

- Show connection count on hover: `"2/4 connections used"`
- Visual indicator on node when approaching capacity (e.g., yellow border at 75%)
- Red border when at capacity

## Testing Requirements

### Unit Tests (`connectionRules.test.ts`)

- `getConnectionCounts()` returns correct inbound/outbound counts
- `getMaxConnections()` returns correct limits for each component type
- `canAcceptConnection()` validates limits correctly

### E2E Tests (`line-drawing.spec.ts`)

1. **Power Plant**:
   - First connection succeeds
   - Second connection attempt shows error message
   - All handles visually disabled after first connection

2. **Substation**:
   - Can connect 1 input + 1 output
   - Third connection (second input or second output) blocked
   - Error message shows which side is occupied

3. **City**:
   - Can connect 6 lines successfully
   - 7th connection attempt shows capacity error

4. **Switching Station / Pylon**:
   - Can connect 4 inputs + 4 outputs
   - 5th connection in either direction blocked

## Implementation Priority

### Phase 1.1 (Core Rules Engine)

1. Create `connectionRules.ts` with core validation logic
2. Integrate into `useLinePlacement` for connection validation
3. Add error messages for all violation scenarios

### Phase 1.2 (Visual Feedback)

1. Update node components to render multiple handles
2. Implement handle enable/disable logic
3. Add CSS styling for handle states

### Phase 1.3 (Polish & Testing)

1. Add connection count tooltips
2. Implement capacity warning indicators
3. Write comprehensive E2E tests

## Future Enhancements (Phase 2+)

- **Dynamic city handles**: Increase to 8-12 handles for Major Metro cities
- **Upgradeable pylons**: Expand from 4 to 6-8 line capacity
- **Breaker management**: Individual breaker control for switching stations
- **Hot-swap connections**: Allow replacing connections without deleting first
- **Connection priority**: Mark critical vs redundant connections

## References

- Component specifications: `docs/ComponentReference.md`
- Voltage cascade rules: `CLAUDE.md` (Voltage Architecture section)
- Line capacity specs: `docs/TransmissionLines.md`
- City demand ranges: `docs/Cities.md`
