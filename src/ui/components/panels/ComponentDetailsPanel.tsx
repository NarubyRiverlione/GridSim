/**
 * Panel displaying details of selected component
 */

import React from 'react'
import type { Component, TransmissionLine } from '@/types'
import { isPowerPlant, isCity, isSubstation, isSwitchingStation, isPylon } from '@/utils/componentUtils'
import {
  renderPowerPlantDetails,
  renderCityDetails,
  renderTransmissionLineDetails,
  renderSubstationDetails,
  renderSwitchingStationDetails,
  renderPylonDetails,
} from './componentRenderers'
import './PanelStyles.css'

interface ComponentDetailsPanelProps {
  component: Component | TransmissionLine | null
}

export const ComponentDetailsPanel = ({ component }: ComponentDetailsPanelProps): React.ReactElement => {
  if (component === null) {
    return (
      <div className="panel details-panel">
        <h2 className="panel-title">Component Details</h2>
        <p className="empty-state">Select a component to view details</p>
      </div>
    )
  }

  return (
    <div className="panel details-panel">
      <h2 className="panel-title">Component Details</h2>
      <div className="details-content">{renderComponentDetails(component)}</div>
    </div>
  )
}

const renderComponentDetails = (component: Component | TransmissionLine): React.ReactElement => {
  // Check if it's a transmission line (has 'from' and 'to' properties)
  if ('from' in component && 'to' in component) {
    return renderTransmissionLineDetails(component)
  }

  // Use type guards from componentUtils
  if (isPowerPlant(component)) {
    return renderPowerPlantDetails(component)
  }

  if (isCity(component)) {
    return renderCityDetails(component)
  }

  if (isSubstation(component)) {
    return renderSubstationDetails(component)
  }

  if (isPylon(component)) {
    return renderPylonDetails(component)
  }

  if (isSwitchingStation(component)) {
    return renderSwitchingStationDetails(component)
  }

  return <div>Unknown component type</div>
}
