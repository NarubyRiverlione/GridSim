# UI Specification (Phase 0)

These mechanics govern how components are placed and positioned on the canvas during Phase 0 UI development.

---

## Critical TODOs for Phase 0

**Persistent Node Movement (Drag-and-Drop):**

- ✅ Persistent node movement (drag-and-drop) implemented and persisted to app state. See `src/App.tsx` and `src/ui/components/canvas/GridCanvas.tsx` for drag handlers and persistence logic.

**Collision Detection Improvements (priority):**

- Harden collision detection so components cannot overlap during placement or after drag (mostly implemented):
  - ✅ Enforce bounding-box checks on placement and during drag (implementation in `src/ui/utils/placement.ts` and used by placement hook and canvas)
  - ✅ Optional buffer-zone enforcement (configurable via Build Menu; default preserved) — `placementBuffer` is persisted in localStorage (`src/App.tsx`) and propagated to the placement logic (`useComponentPlacement`).
  - ✅ Visual preview with valid/invalid states and blocking behavior: ghost preview shows green/red states and placements blocked with an `ErrorToast` message when overlapping occurs (see `src/ui/components/nodes/GhostNode.tsx`, `NodeStyles.css`, `ErrorToast.tsx`).
  - ⚠️ Unit/e2e tests updated to reflect new behavior; placement e2e specs have been hardened to count node types (see `e2e/placement.spec.ts`) and are passing locally. Additional targeted edge-case tests are recommended.
  - ⚠️ Unit/e2e tests updated to reflect new behavior; placement e2e specs have been hardened to count node types (see `e2e/placement.spec.ts`) and are passing locally. Additional targeted edge-case tests are recommended.
  - Recent fixes: placement ghost preview no longer persists after successful placement (ghost cleared and real component added). See `src/ui/hooks/useComponentPlacement.ts` and `src/ui/components/canvas/GridCanvas.tsx` for the placement flow.

Notes: While collision plumbing, buffer support, preview styling and blocking are implemented, some rare overlap flows and additional test coverage remain as follow-ups (see 'Remaining work' below).

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

Note: current implementation enforces snap-to-grid and basic overlap checks in many cases, but there are gaps — it's still possible to place nodes overlapping each other in some workflows. See "Collision Detection Improvements" above for concrete follow-up work.

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
- **Collision Check**: Intended to check every grid position for existing components; current checks are basic and may miss some overlap cases
- **Invalid Drop (intended)**: If released on occupied position, component should snap back to original location (or block placement). This behavior is not fully enforced in all cases yet.
- **Valid Drop**: Component snaps to new grid position and position persists (implemented)

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
- ✅ Bounding-box based collision detection on placement and during drag (buffered overlap checks implemented)
- ✅ Visual feedback (ghost preview shows valid/invalid states; stronger invalid styling added)
- ✅ Visual feedback (ghost preview shows valid/invalid states; stronger invalid styling added)
- ✅ Placement ghost cleared on successful placement (previously some tests observed the ghost remaining after a confirmed placement)
- ✅ Drag-and-drop with collision checking and persistent positions (drag persistence implemented in `App.tsx`)
- ✅ Component size bounding boxes
- ✅ Canvas boundary constraints

**Test and E2E updates:**

- ✅ Playwright e2e tests updated to be robust to ghost previews and placement buffer (see `e2e/placement.spec.ts` and `e2e/collision.spec.ts`). Many placement tests are passing locally after hardening.
- ✅ Playwright e2e tests updated to be robust to ghost previews and placement buffer (see `e2e/placement.spec.ts` and `e2e/collision.spec.ts`). The placement spec was recently fixed to reliably place components even if the test clicks without hovering first; full placement suite passes locally.
- ✅ Performance fixes: RAF-batched mouse-move updates and shallow-equality guards prevent no-op node/edge updates and significantly reduce edge re-renders during mouse move. See `src/ui/components/canvas/GridCanvas.tsx` for batching and guard logic.
- ✅ UX fixes: transmission-line label elements use `pointer-events: none` to avoid pointer interception and hover flicker. Labels are shown on hover/select by default; code supports an 'always show' flag for future toggle.
- ✅ Playwright placement e2e tests passing locally after fixes. Additional e2e additions planned:
  - add a console-capture e2e test that collects and summarizes console logs during a mouse-move sweep (tooling exists in `e2e/edge-render-debug.spec.ts` but it may be toggled off in CI to avoid noisy logs).
  - add tests for optional 'always show' label toggle when implemented.

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
