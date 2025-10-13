/**
 * Build menu for selecting component subtypes
 */

import React from 'react'
import { InteractionMode, PlantType, CitySize, SubstationType } from '@/types'
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
  if (currentMode === InteractionMode.AddPowerPlant) {
    return (
      <div className="build-menu">
        <h3 className="build-menu-title">Select Plant Type</h3>
        <div className="build-menu-options">
          {Object.values(PlantType).map(type => (
            <button
              key={type}
              className={`build-menu-option build-option ${selectedPlantType === type ? 'selected active' : ''}`}
              onClick={() => {
                onPlantTypeChange(type)
              }}
            >
              {formatPlantType(type)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (currentMode === InteractionMode.AddCity) {
    return (
      <div className="build-menu">
        <h3 className="build-menu-title">Select City Size</h3>
        <div className="build-menu-options">
          {Object.values(CitySize).map(size => (
            <button
              key={size}
              className={`build-menu-option build-option ${selectedCitySize === size ? 'selected active' : ''}`}
              onClick={() => {
                onCitySizeChange(size)
              }}
            >
              {formatCitySize(size)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (currentMode === InteractionMode.AddSubstation) {
    return (
      <div className="build-menu">
        <h3 className="build-menu-title">Select Substation Type</h3>
        <div className="build-menu-options">
          <button
            className={`build-menu-option build-option ${selectedSubstationType === SubstationType.Grid ? 'selected active' : ''}`}
            onClick={() => {
              onSubstationTypeChange(SubstationType.Grid)
            }}
          >
            Grid (400→220kV)
          </button>
          <button
            className={`build-menu-option build-option ${selectedSubstationType === SubstationType.Zone ? 'selected active' : ''}`}
            onClick={() => {
              onSubstationTypeChange(SubstationType.Zone)
            }}
          >
            Zone (220→110kV)
          </button>
        </div>
      </div>
    )
  }

  return <div className="build-menu" style={{ display: 'none' }} />
}

const formatPlantType = (type: PlantType): string => {
  const typeMap: Record<PlantType, string> = {
    [PlantType.Nuclear]: 'Nuclear',
    [PlantType.Coal]: 'Coal',
    [PlantType.CCGT]: 'CCGT',
    [PlantType.Hydro]: 'Hydro',
    [PlantType.WindOffshore]: 'Wind (Offshore)',
    [PlantType.WindOnshore]: 'Wind (Onshore)',
    [PlantType.Solar]: 'Solar',
  }
  return typeMap[type]
}

const formatCitySize = (size: CitySize): string => {
  const sizeMap: Record<CitySize, string> = {
    [CitySize.SmallTown]: 'Small Town',
    [CitySize.MediumCity]: 'Medium City',
    [CitySize.LargeCity]: 'Large City',
    [CitySize.MajorMetro]: 'Major Metro',
  }
  return sizeMap[size]
}
