/**
 * Sub-components for BuildMenu
 */

import React from 'react'
import { PlantType, CitySize, SubstationType } from '@/types'
import { PLANT_TYPE_NAMES, CITY_SPECS } from '@/utils/componentSpecs'
import './ToolbarStyles.css'

interface PlantTypeMenuProps {
  selectedType: PlantType
  onTypeChange: (type: PlantType) => void
}

export const PlantTypeMenu = ({ selectedType, onTypeChange }: PlantTypeMenuProps): React.ReactElement => {
  return (
    <div className="build-menu">
      <h3 className="build-menu-title">Select Plant Type</h3>
      <div className="build-menu-options">
        {Object.values(PlantType).map(type => (
          <button
            key={type}
            className={`build-menu-option build-option ${selectedType === type ? 'selected active' : ''}`}
            onClick={() => onTypeChange(type)}
          >
            {PLANT_TYPE_NAMES[type]}
          </button>
        ))}
      </div>
    </div>
  )
}

interface CitySizeMenuProps {
  selectedSize: CitySize
  onSizeChange: (size: CitySize) => void
}

export const CitySizeMenu = ({ selectedSize, onSizeChange }: CitySizeMenuProps): React.ReactElement => {
  return (
    <div className="build-menu">
      <h3 className="build-menu-title">Select City Size</h3>
      <div className="build-menu-options">
        {Object.values(CitySize).map(size => (
          <button
            key={size}
            className={`build-menu-option build-option ${selectedSize === size ? 'selected active' : ''}`}
            onClick={() => onSizeChange(size)}
          >
            {CITY_SPECS[size].displaySize}
          </button>
        ))}
      </div>
    </div>
  )
}

interface SubstationTypeMenuProps {
  selectedType: SubstationType
  onTypeChange: (type: SubstationType) => void
}

export const SubstationTypeMenu = ({ selectedType, onTypeChange }: SubstationTypeMenuProps): React.ReactElement => {
  return (
    <div className="build-menu">
      <h3 className="build-menu-title">Select Substation Type</h3>
      <div className="build-menu-options">
        <button
          className={`build-menu-option build-option ${selectedType === SubstationType.Grid ? 'selected active' : ''}`}
          onClick={() => onTypeChange(SubstationType.Grid)}
        >
          Grid (400→220kV)
        </button>
        <button
          className={`build-menu-option build-option ${selectedType === SubstationType.Zone ? 'selected active' : ''}`}
          onClick={() => onTypeChange(SubstationType.Zone)}
        >
          Zone (220→110kV)
        </button>
      </div>
    </div>
  )
}

interface BufferControlProps {
  value: number
  onChange: (value: number) => void
}

export const BufferControl = ({ value, onChange }: BufferControlProps): React.ReactElement => {
  return (
    <div className="build-menu">
      <h3 className="build-menu-title">Placement Buffer</h3>
      <div className="build-menu-options">
        <input
          aria-label="placement-buffer"
          type="range"
          min={0}
          max={40}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <div style={{ fontSize: 12, marginTop: 6 }}>Buffer: {value}px</div>
      </div>
    </div>
  )
}
