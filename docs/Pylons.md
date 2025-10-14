# Pylons (Transmission Towers)

Intermediate support structures for long-distance transmission lines. Required when line distances exceed maximum span limits.

---

## Purpose and Function

**Purpose**: Provide structural support for transmission lines over long distances

- **Function**: Passive support only (no electrical transformation or switching)
- **Capacity**: Can support multiple lines on same structure (4 lines default)
- **Voltage Compatibility**: Can carry mixed voltages (e.g., 400kV + 220kV on same pylon)
- **Construction Cost**: €500K-1M per pylon
- **Cost vs Substation**: ~50-100x cheaper than substations
- **Cost vs Switching Station**: ~5-10x cheaper than switching stations

---

## Maximum Line Spans

**Distance Limits Without Intermediate Support:**

- **400 kV lines**: 100 km maximum span between supports
- **220 kV lines**: 75 km maximum span between supports
- **110 kV lines**: 50 km maximum span between supports

**When pylons are required:**

- Any line segment exceeding these distances must route through pylons or other infrastructure
- **Phase 1**: System auto-places pylons when drawing long lines
- **Phase 1**: Player can manually adjust pylon positions within distance constraints
- **Phase 0**: Visual warning shown (yellow/orange line color) but not enforced

---

## Line Capacity per Pylon

**Default Pylon:**

- **Capacity**: 4 transmission lines
- **Upgrade Path** (Phase 2): Can upgrade to 6 or 8 line capacity
- **Multi-line Benefits**: First line pays for pylon infrastructure, additional lines reuse it (cost savings)
- **Voltage Mixing**: Can carry lines of different voltages on same structure

**Examples:**

```
Single-line usage:
Plant A → Pylon1 → Pylon2 → City B
(1 × 400kV line, pylons at 25% capacity)

Multi-line to same destination:
Plant A ⇒⇒⇒ Pylon1 ⇒⇒⇒ Pylon2 ⇒⇒⇒ City B
(4 × 400kV lines for high capacity, pylons at 100% capacity)

Mixed voltage on same pylon:
Plant A → Pylon1 → Grid Sub (2 × 400kV lines)
Grid Sub → Pylon1 → Zone Sub (2 × 220kV lines)
(Pylon1 carries both 400kV and 220kV lines)
```

---

## Strategic Use Cases

### Long-Distance Transmission

**Scenario**: Plant 250km from city cluster

```
Without pylons: ❌ Cannot build (exceeds 100km max span)

With pylons:
Plant (400kV) → Pylon1 (83km) → Pylon2 (83km) → Grid Sub (84km) ✅
Cost: Line (€375M) + Pylons (€2M) = €377M total
```

### Transmission Corridors

**Scenario**: Building high-capacity routes between regions

```
First line:
Plant A → Pylon1 → Pylon2 → Grid Sub
Cost: Line + 2 pylons = €377M

Second line (parallel capacity):
Plant A ⇒ Pylon1 → Pylon2 ⇒ Grid Sub
Cost: Line only = €375M (reuses existing pylons, saves €2M!)

Third & fourth lines:
Plant A ⇒⇒⇒ Pylon1 → Pylon2 ⇒⇒⇒ Grid Sub
Cost: 2 × €375M = €750M (total 4 lines sharing pylons)

Total capacity: 4 × 2000 MVA = 8000 MVA corridor
Pylon cost: €2M (amortized across 4 lines = €0.5M per line)
```

### Routing Around Obstacles

**Scenario**: Mountains or water bodies require non-straight routing

```
Direct path blocked by Alps:
Plant → [❌ Mountains] → City

Routed with pylons:
Plant → Pylon1 (west) → Pylon2 (south) → Pylon3 (east) → City ✅
(Pylons act as waypoints for flexible routing)
```

---

## Comparison to Other Infrastructure

| Component         | Cost    | Function                      | Lines Supported | Voltage Transform | Breaker Control |
| ----------------- | ------- | ----------------------------- | --------------- | ----------------- | --------------- |
| Pylon             | €0.5-1M | Structural support only       | 4-8             | No                | No              |
| Switching Station | €5-10M  | Routing + Breaker control     | Unlimited       | No                | Yes             |
| Zone Substation   | €20-40M | Voltage transformation        | Unlimited       | 220→110 kV        | Yes             |
| Grid Substation   | €50-80M | Voltage transformation (bulk) | Unlimited       | 400→220 kV        | Yes             |

**When to use each:**

- **Pylon**: Need distance >max span OR want to route multiple lines along same path
- **Switching Station**: Need breaker control OR complex routing/switching
- **Zone Substation**: Need to step down 220kV→110kV for city delivery
- **Grid Substation**: Need to step down 400kV→220kV for regional distribution

---

## Pylon Failure (Phase 2)

**Criticality Scales with Line Count:**

- Pylon with 1 line: Low criticality (single line failure)
- Pylon with 4 lines: High criticality (4 lines fail simultaneously)
- Risk vs. cost tradeoff: Shared infrastructure is cheaper but creates single point of failure

**Maintenance Strategy:**

- Build redundant paths to survive pylon failures
- Don't put all transmission capacity through single pylon chain
- Consider N-1 contingency for critical corridors

---

## Quick Reference

| Type             | Cost     | Lines Supported | Notes                             |
| ---------------- | -------- | --------------- | --------------------------------- |
| Pylon (Default)  | €0.5-1M  | 4               | Structural support for long lines |
| Pylon (Upgraded) | +€0.5-1M | 6-8             | Phase 2 feature                   |

---

## Related Documents

- See [TransmissionLines.md](./TransmissionLines.md) for maximum span distances by voltage
- See [SwitchingStations.md](./SwitchingStations.md) for routing with breaker control
- See [Substations.md](./Substations.md) for voltage transformation infrastructure
- See [GameplayGuide.md](./GameplayGuide.md) for pylon placement strategy
