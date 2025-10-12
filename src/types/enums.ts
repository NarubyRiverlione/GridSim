/**
 * Enumerations for GridSim types
 */

export enum PlantType {
  Nuclear = 'nuclear',
  Coal = 'coal',
  CCGT = 'ccgt',
  Hydro = 'hydro',
  WindOffshore = 'wind-offshore',
  WindOnshore = 'wind-onshore',
  Solar = 'solar',
}

export enum CitySize {
  SmallTown = 'small-town',
  MediumCity = 'medium-city',
  LargeCity = 'large-city',
  MajorMetro = 'major-metro',
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',
}

export enum VoltageLevel {
  KV400 = 400,
  KV220 = 220,
  KV110 = 110,
  KV33 = 33,
}

export enum ComponentState {
  Healthy = 'healthy',
  Stressed = 'stressed',
  Failed = 'failed',
  Disconnected = 'disconnected',
}

export enum InteractionMode {
  Select = 'select',
  AddPowerPlant = 'add-power-plant',
  AddCity = 'add-city',
  AddTransmissionLine = 'add-transmission-line',
  AddSubstation = 'add-substation',
  AddSwitchingStation = 'add-switching-station',
}
