/**
 * Build menu for selecting component subtypes
 */

import React from 'react'
import { InteractionMode, PlantType, CitySize, SubstationType } from '@/types'
import { PlantTypeMenu, CitySizeMenu, SubstationTypeMenu, BufferControl } from './buildMenuComponents'
import './ToolbarStyles.css'

interface BuildMenuProps {
  currentMode: InteractionMode
  selectedPlantType: PlantType
  selectedCitySize: CitySize
  selectedSubstationType: SubstationType
  onPlantTypeChange: (type: PlantType) => void
  onCitySizeChange: (size: CitySize) => void
  onSubstationTypeChange: (type: SubstationType) => void
  placementBuffer: number
  onPlacementBufferChange: (v: number) => void
}

export const BuildMenu = ({
  currentMode,
  selectedPlantType,
  selectedCitySize,
  selectedSubstationType,
  onPlantTypeChange,
  onCitySizeChange,
  onSubstationTypeChange,
  placementBuffer,
  onPlacementBufferChange,
}: BuildMenuProps): React.ReactElement => {
  let modeSpecificMenu: React.ReactElement | null = null

  if (currentMode === InteractionMode.AddPowerPlant) {
    modeSpecificMenu = <PlantTypeMenu selectedType={selectedPlantType} onTypeChange={onPlantTypeChange} />
  } else if (currentMode === InteractionMode.AddCity) {
    modeSpecificMenu = <CitySizeMenu selectedSize={selectedCitySize} onSizeChange={onCitySizeChange} />
  } else if (currentMode === InteractionMode.AddSubstation) {
    modeSpecificMenu = (
      <SubstationTypeMenu selectedType={selectedSubstationType} onTypeChange={onSubstationTypeChange} />
    )
  }

  return (
    <div>
      {modeSpecificMenu}
      <BufferControl value={placementBuffer} onChange={onPlacementBufferChange} />
    </div>
  )
}
