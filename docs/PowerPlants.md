# Power Plants

All plants auto-dispatch to match demand up to their maximum capacity in V1.

---

## Nuclear

- **Capacity**: 900-1650 MW
- **Type**: Baseload
- **Ramp Rate**: Slow (hours)
- **Construction Cost**: €4-6B (1000 MW)
- **Operating Characteristics**: Cannot quickly adjust output, best for constant baseload
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Provide stable baseload power 24/7
- **Output Voltage**: 400 kV (fixed)

## Coal (Legacy)

- **Capacity**: 500-1000 MW
- **Type**: Baseload/intermediate
- **Ramp Rate**: Medium (30-60 min)
- **Construction Cost**: €2-3B (coal default 800 MW — see ComponentReference.md)
- **Operating Characteristics**: Being phased out, moderate flexibility
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Supplement baseload, being replaced by cleaner sources
- **Output Voltage**: 400 kV (fixed)

## CCGT (Combined Cycle Gas Turbine)

- **Capacity**: 400-800 MW
- **Type**: Peaking/intermediate
- **Ramp Rate**: Fast (10-15 min)
- **Construction Cost**: €800M-1.2B (CCGT default 600 MW — see ComponentReference.md)
- **Operating Characteristics**: Good for load following, flexible
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Handle demand fluctuations, peak load
- **Output Voltage**: 400 kV (fixed)

## Hydro

- **Capacity**: 100-2000 MW
- **Type**: Dispatchable/peaking
- **Ramp Rate**: Instant
- **Construction Cost**: €2-4B (hydro default 500 MW, location dependent — see ComponentReference.md)
- **Operating Characteristics**: Perfect for balancing, limited by water availability
- **V1 Behavior**: Auto-dispatch up to capacity
- **Typical Use**: Rapid response to demand changes, emergency reserves
- **Geographic Constraint**: Requires suitable water resources
- **Output Voltage**: 400 kV (fixed)

## Wind Offshore

- **Capacity**: 400-1200 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €1.5-2.5B (wind offshore default 800 MW farm — see ComponentReference.md)
- **Location Constraint**: Coastal areas
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Weather-dependent generation
- **Typical Use**: Renewable energy source, high capacity factor
- **Output Voltage**: 400 kV (fixed)

## Wind Onshore

- **Capacity**: 50-300 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €150-250M (100 MW farm)
- **Location Constraint**: Open terrain
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Weather-dependent generation
- **Typical Use**: Distributed renewable energy, lower cost than offshore
- **Output Voltage**: 400 kV (fixed)

## Solar

- **Capacity**: 50-300 MW (farms)
- **Type**: Variable (V2 feature - intermittent generation)
- **Construction Cost**: €100-200M (100 MW farm)
- **Location Preference**: Southern Europe (higher solar irradiance)
- **V1 Behavior**: Auto-dispatch up to capacity (no variability yet)
- **V2 Enhancement**: Day/night cycle, weather-dependent generation
- **Typical Use**: Daytime renewable energy, peaks with demand
- **Output Voltage**: 400 kV (fixed)

---

## Quick Reference

| Type     | Capacity    | Cost       | Ramp Rate | Best For               |
| -------- | ----------- | ---------- | --------- | ---------------------- |
| Nuclear  | 900-1650 MW | €4-6B      | Slow      | Baseload 24/7          |
| Coal     | 500-1000 MW | €2-3B      | Medium    | Legacy baseload        |
| CCGT     | 400-800 MW  | €800M-1.2B | Fast      | Peaking, flexibility   |
| Hydro    | 100-2000 MW | €2-4B      | Instant   | Balancing, emergency   |
| Wind Off | 400-1200 MW | €1.5-2.5B  | N/A (V2)  | Coastal renewables     |
| Wind On  | 50-300 MW   | €150-250M  | N/A (V2)  | Distributed renewables |
| Solar    | 50-300 MW   | €100-200M  | N/A (V2)  | Daytime renewables     |

---

## Related Documents

- See [Cities.md](./Cities.md) for power demand specifications
- See [TransmissionLines.md](./TransmissionLines.md) for 400kV line specifications
- See [Substations.md](./Substations.md) for voltage transformation
- See [GameplayGuide.md](./GameplayGuide.md) for plant selection strategy
