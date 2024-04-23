import { ColorTheme } from '@/pax/shared/types/colorTheme';

export interface PaxLightTheme {
  name: string;
  theme: ColorTheme;
}

const themeDefault: PaxLightTheme = {
  name: 'Default',
  theme: {
    heating: {
      animation: 0,
      color1: {
        blue: 0,
        green: 0,
        red: 0,
      },
      color2: {
        blue: 0,
        green: 0,
        red: 0,
      },
      frequency: 0,
    },
    regulating: {
      animation: 0,
      color1: {
        blue: 0,
        green: 0,
        red: 0,
      },
      color2: {
        blue: 0,
        green: 0,
        red: 0,
      },
      frequency: 0,
    },
    standby: {
      animation: 0,
      color1: {
        blue: 0,
        green: 0,
        red: 0,
      },
      color2: {
        blue: 0,
        green: 0,
        red: 0,
      },
      frequency: 0,
    },
    startup: {
      animation: 0,
      color1: {
        blue: 0,
        green: 0,
        red: 0,
      },
      color2: {
        blue: 0,
        green: 0,
        red: 0,
      },
      frequency: 0,
    },
  },
};

const themeOcean: PaxLightTheme = {
  name: 'Ocean',
  theme: {
    heating: {
      animation: 0,
      color1: {
        blue: 40,
        green: 7,
        red: 19,
      },
      color2: {
        blue: 255,
        green: 0,
        red: 40,
      },
      frequency: 16,
    },
    regulating: {
      animation: 2,
      color1: {
        blue: 67,
        green: 92,
        red: 36,
      },
      color2: {
        blue: 255,
        green: 0,
        red: 0,
      },
      frequency: 9,
    },
    standby: {
      animation: 1,
      color1: {
        blue: 20,
        green: 20,
        red: 0,
      },
      color2: {
        blue: 255,
        green: 0,
        red: 0,
      },
      frequency: 6,
    },
    startup: {
      animation: 0,
      color1: {
        blue: 255,
        green: 0,
        red: 0,
      },
      color2: {
        blue: 117,
        green: 108,
        red: 0,
      },
      frequency: 17,
    },
  },
};

const themeSunset: PaxLightTheme = {
  name: 'Sunset',
  theme: {
    heating: {
      animation: 0,
      color1: {
        blue: 40,
        green: 115,
        red: 255,
      },
      color2: {
        blue: 104,
        green: 0,
        red: 153,
      },
      frequency: 15,
    },
    regulating: {
      animation: 2,
      color1: {
        blue: 40,
        green: 149,
        red: 253,
      },
      color2: {
        blue: 136,
        green: 0,
        red: 153,
      },
      frequency: 11,
    },
    standby: {
      animation: 1,
      color1: {
        blue: 125,
        green: 114,
        red: 255,
      },
      color2: {
        blue: 154,
        green: 64,
        red: 0,
      },
      frequency: 6,
    },
    startup: {
      animation: 1,
      color1: {
        blue: 40,
        green: 115,
        red: 255,
      },
      color2: {
        blue: 104,
        green: 0,
        red: 153,
      },
      frequency: 5,
    },
  },
};

const themeMars: PaxLightTheme = {
  name: 'Mars',
  theme: {
    heating: {
      animation: 0,
      color1: {
        blue: 0,
        green: 0,
        red: 255,
      },
      color2: {
        blue: 1,
        green: 2,
        red: 3,
      },
      frequency: 17,
    },
    regulating: {
      animation: 2,
      color1: {
        blue: 3,
        green: 22,
        red: 255,
      },
      color2: {
        blue: 1,
        green: 2,
        red: 3,
      },
      frequency: 9,
    },
    standby: {
      animation: 1,
      color1: {
        blue: 10,
        green: 30,
        red: 250,
      },
      color2: {
        blue: 12,
        green: 15,
        red: 4,
      },
      frequency: 7,
    },
    startup: {
      animation: 2,
      color1: {
        blue: 0,
        green: 0,
        red: 250,
      },
      color2: {
        blue: 0,
        green: 20,
        red: 60,
      },
      frequency: 27,
    },
  },
};

export const hardcodedThemes = [
  themeDefault,
  themeOcean,
  themeSunset,
  themeMars,
];
