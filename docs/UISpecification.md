# UI Specification (Phase 0)

These mechanics govern how components are placed and positioned on the canvas during Phase 0 UI development.

---

## Snap-to-Grid

**Purpose**: Provide clean, aligned component placement and prevent free-form positioning chaos.

- **Grid Size**: 50 pixels (configurable)
- **Behavior**: All component placements automatically snap to nearest grid intersection
- **Visual Feedback**: Optional grid overlay (toggle on/off)
- **Applies To**: All node components (power plants, cities, substations, switching stations, pylons)
- **Line Routing**: Lines connect to snapped component positions (no snap-to-grid for line paths)

### Benefits

1. **Clean Layout**: Components align naturally on grid
2. **Easier Selection**: Predictable component positions
3. **Professional Look**: Grid-aligned infrastructure looks intentional
4. **Distance Calculation**: Simplified when components align to grid units

### Implementation (Phase 0)

```
User clicks at position (123, 456)
Snap calculation:
  x_snapped = round(123 / 50) * 50 = 100
  y_snapped = round(456 / 50) * 50 = 450
Component placed at (100, 450)
```

---

## Collision Detection and Avoidance

**Purpose**: Prevent components from overlapping, which would be visually confusing and physically impossible.

### Node Collision Rules

**No Overlap Rule:** Two components cannot occupy the same grid position or have overlapping bounding boxes.

**Collision Detection (Phase 0):**

- **Check on Placement**: Before placing component, check if position is occupied
- **Check on Drag**: While dragging component, continuously check for collisions
- **Bounding Box**: Each component type has defined size (e.g., power plant = 80×80px, city = 60×60px)
- **Buffer Zone**: Optional padding around components (e.g., 10px margin)

**Visual Feedback:**

```
Valid placement:
  - Cursor: Green outline or checkmark
  - Component preview: Green tint
  - Action: Allow placement on click

Invalid placement (collision detected):
  - Cursor: Red outline or X symbol
  - Component preview: Red tint or dashed outline
  - Action: Block placement, show tooltip "Space occupied"
```

**Drag Behavior:**

- **While Dragging**: Component follows cursor with snap-to-grid
- **Collision Check**: Every grid position checked for existing components
- **Invalid Drop**: If released on occupied position, component snaps back to original location
- **Valid Drop**: Component snaps to new grid position

### Line Crossing Rules (Phase 0 - Visual Only)

**Note**: In Phase 0, line crossing is **visually permitted** but **discouraged** through UI hints. Full enforcement happens in Phase 1 when routing logic is implemented.

**Phase 0 Behavior (Visual Hints Only):**

- Lines CAN cross each other (no enforcement)
- Visual indicator when lines cross (e.g., yellow warning dot at intersection)
- No gameplay penalty (Phase 0 is UI proof of concept)
- Tooltip on hover: "Transmission lines should not cross - consider rerouting with pylons"

**Phase 1 Enforcement (Future):**

- Line routing algorithm prevents crossings
- Auto-insert pylons or switching stations when path would cross existing line
- Player can manually route around obstacles using intermediate waypoints
- Crossing prevention enforced during line drawing mode

**Why Defer Full Enforcement?**

- Phase 0 is UI/visual only (no simulation logic)
- Line routing with obstacles requires pathfinding algorithms
- Auto-pylon placement depends on distance and routing calculations
- Better to show visual hints now, enforce in Phase 1 when simulation active

### Placement Validation Matrix

| Scenario                         | Phase 0 Behavior          | Visual Feedback            | Phase 1 Enforcement |
| -------------------------------- | ------------------------- | -------------------------- | ------------------- |
| Component on occupied grid cell  | ❌ Blocked                | Red outline, error tooltip | ❌ Blocked          |
| Component overlapping another    | ❌ Blocked                | Red outline, error tooltip | ❌ Blocked          |
| Line crossing another line       | ⚠️ Allowed (with warning) | Yellow warning indicator   | ❌ Blocked          |
| Line > max span without pylon    | ⚠️ Allowed (with warning) | Yellow/orange line color   | ❌ Blocked          |
| Dragging component off-canvas    | ❌ Blocked                | Component constrained      | ❌ Blocked          |
| Placing component on canvas edge | ✅ Allowed                | Green outline              | ✅ Allowed          |

---

## Component Size Reference (Bounding Boxes)

**For Collision Detection:**

| Component Type    | Width (px) | Height (px) | Notes                    |
| ----------------- | ---------- | ----------- | ------------------------ |
| Power Plant       | 80         | 80          | Largest node type        |
| City (Small)      | 50         | 50          | Scales with city size    |
| City (Medium)     | 60         | 60          |                          |
| City (Large)      | 70         | 70          |                          |
| City (Metro)      | 80         | 80          | Same size as power plant |
| Grid Substation   | 60         | 60          | Square footprint         |
| Zone Substation   | 50         | 50          | Smaller than grid sub    |
| Switching Station | 40         | 40          | Smallest infrastructure  |
| Pylon             | 30         | 30          | Minimal footprint        |

**Buffer Zone (Optional):**

- **Default**: No buffer (components can be adjacent on touching grid cells)
- **Optional**: 10px buffer around each component (enforced in settings)
- **Purpose**: Reduce visual clutter, create breathing room

---

## Interaction Mode Behavior

### Select/Pan Mode (default)

- Click component to select (show details panel)
- Click-and-drag to pan canvas
- Click-and-drag component to move (with collision detection)
- Snap-to-grid applies to component movement

### Add Component Modes (Plant, City, Substation, etc.)

- Cursor shows component preview (semi-transparent)
- Preview follows cursor with snap-to-grid
- Preview shows green (valid) or red (collision) tint
- Click to place if valid position
- Escape or mode switch cancels placement

### Add Transmission Line Mode

- Click source component (must be valid connection point)
- Drag to target component
- Line preview shows during drag
- Yellow warning if line >max span or crosses existing line
- Click target to complete line (allowed even with warnings in Phase 0)
- Right-click or Escape to cancel line

---

## Phase 0 Implementation Summary

**Implemented (Phase 0):**

- ✅ Snap-to-grid for all component placements
- ✅ Node collision detection (prevent overlap)
- ✅ Visual feedback (green/red outlines)
- ✅ Drag-and-drop with collision checking
- ✅ Component size bounding boxes
- ✅ Canvas boundary constraints

**Visual Hints Only (Phase 0):**

- ⚠️ Line crossing warnings (yellow indicator)
- ⚠️ Line distance warnings (color change if >max span)
- ⚠️ Tooltip guidance ("Consider adding pylon")

**Deferred to Phase 1 (Simulation Logic):**

- 🔮 Line crossing prevention (enforced)
- 🔮 Auto-pylon placement for long lines
- 🔮 Voltage compatibility validation
- 🔮 Connection point validation (correct voltage matching)
- 🔮 Pathfinding around obstacles

---

## Related Documents

- See [PowerPlants.md](./PowerPlants.md) for component specifications
- See [Cities.md](./Cities.md) for city sizes and visual representation
- See [TransmissionLines.md](./TransmissionLines.md) for line visual styling
- See [Pylons.md](./Pylons.md) for pylon visual representation
- See README.md for Phase 0 implementation status
