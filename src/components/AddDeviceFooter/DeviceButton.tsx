import { ChevronDown } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Props {
  options: Options[];
  onValueChange?: ((value: string) => void) | undefined;
  value?: string;
}

interface Options {
  value: string;
  label: string;
}

const DeviceButton = ({ options, onValueChange, value }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {value} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map(option => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DeviceButton;
