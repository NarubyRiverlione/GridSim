/**
 * Build menu for selecting component subtypes
 */

import React from 'react'
import { InteractionMode, PlantType, CitySize, SubstationType } from '@/types'
import { PlantTypeMenu, CitySizeMenu, SubstationTypeMenu } from './buildMenuComponents'
import './ToolbarStyles.css'

interface BuildMenuProps {
  currentMode: InteractionMode
  selectedPlantType: PlantType
  selectedCitySize: CitySize
  selectedSubstationType: SubstationType
  onPlantTypeChange: (type: PlantType) => void
  onCitySizeChange: (size: CitySize) => void
  onSubstationTypeChange: (type: SubstationType) => void
}

export const BuildMenu = ({
  currentMode,
  selectedPlantType,
  selectedCitySize,
  selectedSubstationType,
  onPlantTypeChange,
  onCitySizeChange,
  onSubstationTypeChange,
}: BuildMenuProps): React.ReactElement | null => {
  const menu =
    currentMode === InteractionMode.AddPowerPlant ? (
      <PlantTypeMenu selectedType={selectedPlantType} onTypeChange={onPlantTypeChange} />
    ) : currentMode === InteractionMode.AddCity ? (
      <CitySizeMenu selectedSize={selectedCitySize} onSizeChange={onCitySizeChange} />
    ) : currentMode === InteractionMode.AddSubstation ? (
      <SubstationTypeMenu selectedType={selectedSubstationType} onTypeChange={onSubstationTypeChange} />
    ) : null

  if (!menu) {
    return null
  }

  return <div>{menu}</div>
}
