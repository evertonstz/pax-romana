export enum HeatingStates {
  // heating oven
  HEATING = 0,
  // near target temp
  READY = 1,
  // lip detection boost
  BOOSTING = 2,
  // lip detection cooling
  COOLING = 3,
  // standby due to not moving device
  STANDBY = 4,
  // when oven is off
  OVEN_OFF = 5,
  // when in temperature selection by holding pax button
  TEMP_SET_MODE = 6,
}
