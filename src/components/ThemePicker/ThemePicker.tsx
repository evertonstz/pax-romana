import { ColorTheme } from '@/pax/shared/types/colorTheme';

import { ThemeCircle } from './ThemeCircle';
import { PaxLightTheme } from './colors';

export interface IThemePickerProps {
  colorThemes?: PaxLightTheme[];
  selectedThemeIndex?: number;
  onClick?: (selectedTheme: ColorTheme) => void;
  loading?: boolean;
}

export function ThemePicker(props: IThemePickerProps) {
  if (props.loading ?? !props.colorThemes) {
    return (
      <div className="flex animate-pulse flex-row gap-2">
        <div className="flex flex-col gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="col-span-2 h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="col-span-2 h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="col-span-2 h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="col-span-2 h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      {props.colorThemes.map((theme, index) => {
        return (
          <div key={index}>
            <ThemeCircle
              style={{
                backgroundImage: `linear-gradient(to bottom, 
                    rgb(${theme.theme.regulating.color1.red}, 
                        ${theme.theme.regulating.color1.green}, 
                        ${theme.theme.regulating.color1.blue}), 
                    rgb(${theme.theme.regulating.color2.red}, 
                        ${theme.theme.regulating.color2.green}, 
                        ${theme.theme.regulating.color2.blue}))`,
              }}
              selected={index === props.selectedThemeIndex}
              onClick={() => props.onClick?.(theme.theme)}
            />
            <p>{theme.name}</p>
          </div>
        );
      })}
    </div>
  );
}
