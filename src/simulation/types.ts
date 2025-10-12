/**
 * Simulation-specific types (stubs for Phase 0)
 * These will be fully implemented in Phase 1
 */

export interface PowerFlowData {
  flows: Record<string, number>
  voltages: Record<string, number>
}

export interface ScheduledEvent {
  id: string
  timestamp: Date
  type: string
  data: unknown
}
