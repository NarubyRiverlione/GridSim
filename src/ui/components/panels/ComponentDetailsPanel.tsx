/**
 * Panel displaying details of selected component
 */

import React from 'react'
import type { Component, TransmissionLine, City, PowerPlant, Substation, SwitchingStation, Pylon } from '@/types'
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
    return renderLineDetails(component)
  }

  // Check if it's a city (has 'name' property)
  if ('name' in component) {
    return renderCityDetails(component)
  }

  // Check if it's a power plant (has 'type' and 'capacity' and 'currentOutput')
  if ('type' in component && 'capacity' in component && 'currentOutput' in component) {
    return renderPlantDetails(component)
  }

  // Check if it's a substation (has 'voltageIn' and 'voltageOut')
  if ('voltageIn' in component && 'voltageOut' in component) {
    return renderSubstationDetails(component)
  }

  // Check if it's a pylon (has 'maxLines')
  if ('maxLines' in component) {
    return renderPylonDetails(component)
  }

  // Check if it's a switching station (has 'breakers')
  if ('breakers' in component) {
    return renderSwitchingStationDetails(component)
  }

  return <div>Unknown component type</div>
}

const renderPlantDetails = (plant: PowerPlant): React.ReactElement => (
  <div className="detail-section">
    <h3 className="detail-heading">Power Plant</h3>
    <DetailRow label="Type" value={plant.type} />
    <DetailRow label="Capacity" value={`${plant.capacity} MW`} />
    <DetailRow label="Current Output" value={`${plant.currentOutput} MW`} />
    <DetailRow label="Utilization" value={`${Math.round((plant.currentOutput / plant.capacity) * 100)}%`} />
    <DetailRow label="Ramp Rate" value={`${plant.rampRate} MW/min`} />
    <DetailRow label="State" value={plant.state} />
  </div>
)

const renderCityDetails = (city: City): React.ReactElement => (
  <div className="detail-section">
    <h3 className="detail-heading">City</h3>
    <DetailRow label="Name" value={city.name} />
    <DetailRow label="Size" value={city.size} />
    <DetailRow label="Base Demand" value={`${city.baseDemand} MW`} />
    <DetailRow label="Current Demand" value={`${city.currentDemand} MW`} />
    <DetailRow label="Power Received" value={`${city.powerReceived} MW`} />
    <DetailRow label="Connected" value={city.connected ? 'Yes' : 'No'} />
    <DetailRow label="State" value={city.state} />
  </div>
)

const renderLineDetails = (line: TransmissionLine): React.ReactElement => (
  <div className="detail-section">
    <h3 className="detail-heading">Transmission Line</h3>
    <DetailRow label="Voltage" value={`${line.voltage} kV`} />
    <DetailRow label="Capacity" value={`${line.capacity} MVA`} />
    <DetailRow label="Current Load" value={`${line.currentLoad} MVA`} />
    <DetailRow label="Utilization" value={`${Math.round((line.currentLoad / line.capacity) * 100)}%`} />
    <DetailRow label="Distance" value={`${line.distance} km`} />
    <DetailRow label="Breaker" value={line.breakerClosed ? 'Closed' : 'Open'} />
    <DetailRow label="Tripped" value={line.breakerTripped ? 'Yes' : 'No'} />
    <DetailRow label="State" value={line.state} />
  </div>
)

const renderSubstationDetails = (substation: Substation): React.ReactElement => (
  <div className="detail-section">
    <h3 className="detail-heading">Substation</h3>
    <DetailRow label="Voltage In" value={`${substation.voltageIn} kV`} />
    <DetailRow label="Voltage Out" value={`${substation.voltageOut} kV`} />
    <DetailRow label="Capacity" value={`${substation.capacity} MVA`} />
    <DetailRow label="Current Load" value={`${substation.currentLoad} MVA`} />
    <DetailRow label="Utilization" value={`${Math.round((substation.currentLoad / substation.capacity) * 100)}%`} />
    <DetailRow label="Losses" value={`${substation.losses}%`} />
    <DetailRow label="Breakers" value={`${substation.breakers.length}`} />
    <DetailRow label="State" value={substation.state} />
  </div>
)

const renderSwitchingStationDetails = (station: SwitchingStation): React.ReactElement => {
  const closedBreakers = station.breakers.filter(b => b.closed && !b.tripped).length

  return (
    <div className="detail-section">
      <h3 className="detail-heading">Switching Station</h3>
      <DetailRow label="Connected Lines" value={`${station.connectedLines.length}`} />
      <DetailRow label="Total Breakers" value={`${station.breakers.length}`} />
      <DetailRow label="Closed Breakers" value={`${closedBreakers}`} />
      <DetailRow label="State" value={station.state} />
    </div>
  )
}

const renderPylonDetails = (pylon: Pylon): React.ReactElement => {
  const utilization = Math.round((pylon.connectedLines.length / pylon.maxLines) * 100)

  return (
    <div className="detail-section">
      <h3 className="detail-heading">Pylon</h3>
      <DetailRow label="Max Lines" value={`${pylon.maxLines}`} />
      <DetailRow label="Connected Lines" value={`${pylon.connectedLines.length}`} />
      <DetailRow label="Utilization" value={`${utilization}%`} />
      {pylon.voltageLevel !== undefined && <DetailRow label="Voltage" value={`${pylon.voltageLevel} kV`} />}
      <DetailRow label="State" value={pylon.state} />
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string | number
}

const DetailRow = ({ label, value }: DetailRowProps): React.ReactElement => (
  <div className="detail-row">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
)
