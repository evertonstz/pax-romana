export interface ColorTheme {
  heating: ColorMode;
  regulating: ColorMode;
  standby: ColorMode;
  startup: ColorMode;
}

export interface ColorMode {
  animation: number;
  color1: {
    blue: number;
    green: number;
    red: number;
  };
  color2: {
    blue: number;
    green: number;
    red: number;
  };
  frequency: number;
}
