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

  return <div>{modeSpecificMenu}</div>
}
