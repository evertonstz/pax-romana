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
  OVEN_OFF = 5,
  TEMP_SET_MODE = 6,
}
