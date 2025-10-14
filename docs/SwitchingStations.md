# Switching Stations

Enable complex grid topologies through passive routing and breaker control.

---

## Characteristics

- **Purpose**: Connect multiple transmission line segments and route power
- **Voltage Transformation**: None (passive routing at same voltage)
- **Construction Cost**: €5-10M (simple routing junction)
- **Breaker Control**: Player can manually open/close breakers
- **Protection**: Automatically trips breakers on overload
- **Cost vs Substation**: ~10x cheaper
- **Cost vs Pylon**: ~5-10x more expensive

---

## Use Cases

### Line Intersections/Junctions

- Connect 3+ line segments at a point
- Enable complex grid topologies
- Split power flows

### Grid Redundancy (N-1 Contingency)

- Create parallel paths between nodes
- If one line fails, power reroutes through others
- Critical for grid reliability

### Fault Isolation

- Disconnect problem segments without affecting entire grid
- Manual breaker control allows surgical grid management
- Essential for maintenance and crisis response

### Complex Grid Topologies

- Mesh networks instead of simple trees
- Multiple paths from generation to load
- More resilient but requires careful capacity planning

---

## Breaker States

- **Closed**: Power flows through breaker normally
- **Open**: Manual disconnect, no power flow
- **Tripped**: Automatic disconnect due to overload, requires manual reset

---

## Strategic Considerations

### When to Use Switching Stations

- **Need breaker control**: Manual control over power flow paths
- **Complex routing**: Creating mesh topologies with multiple paths
- **Fault isolation**: Ability to disconnect sections without affecting whole grid
- **Cost-effective junctions**: Much cheaper than substations when voltage transformation not needed

### When NOT to Use Switching Stations

- **Need voltage transformation**: Use substations instead (grid or zone)
- **Simple point-to-point lines**: Direct connection is simpler
- **Long-distance support only**: Use pylons instead (much cheaper)

### Comparison to Other Infrastructure

| Component         | Cost    | Function                      | Voltage Transform | Breaker Control |
| ----------------- | ------- | ----------------------------- | ----------------- | --------------- |
| Pylon             | €0.5-1M | Structural support only       | No                | No              |
| Switching Station | €5-10M  | Routing + Breaker control     | No                | Yes             |
| Zone Substation   | €20-40M | Voltage transformation        | 220→110 kV        | Yes             |
| Grid Substation   | €50-80M | Voltage transformation (bulk) | 400→220 kV        | Yes             |

---

## Example Scenarios

### Redundant Path (N-1 Contingency)

```
Before (no redundancy):
Plant → Line1 → City
Risk: If Line1 fails, city loses power

After (with switching station):
Plant → Line1 ↘
               Switching Station → City
Plant → Line2 ↗
Benefit: If either line fails, power continues through the other
```

### Fault Isolation

```
Grid topology:
Plant A → Switching Station 1 → Line1 → Switching Station 2 → City A
                  ↓                           ↓
                Line2                       Line3
                  ↓                           ↓
          Switching Station 3 → Line4 → Switching Station 4 → City B

Problem: Line2 has fault
Solution: Open breakers at Switching Stations 1 and 3
Result: Line2 isolated, rest of grid continues operating
```

### Load Balancing

```
Heavy load scenario:
Plant (2000 MW) → Switching Station → Line1 (1200 MW) → City A
                        ↓
                      Line2 (800 MW) → City B

Benefit: Single connection point distributes load across multiple paths
```

---

## Related Documents

- See [TransmissionLines.md](./TransmissionLines.md) for line capacity and voltage levels
- See [Substations.md](./Substations.md) for voltage transformation requirements
- See [Pylons.md](./Pylons.md) for simpler structural support (no breaker control)
- See [GameplayGuide.md](./GameplayGuide.md) for when to use switching stations
