/**
 * Hook for managing component selection
 */

import { useState, useCallback } from 'react'
import type { Component, TransmissionLine } from '@/types'

export interface UseSelectionReturn {
  selectedComponent: Component | TransmissionLine | null
  selectComponent: (component: Component | TransmissionLine | null) => void
  clearSelection: () => void
}

export const useSelection = (): UseSelectionReturn => {
  const [selectedComponent, setSelectedComponent] = useState<Component | TransmissionLine | null>(null)

  const selectComponent = useCallback((component: Component | TransmissionLine | null): void => {
    setSelectedComponent(component)
  }, [])

  const clearSelection = useCallback((): void => {
    setSelectedComponent(null)
  }, [])

  return {
    selectedComponent,
    selectComponent,
    clearSelection,
  }
}
