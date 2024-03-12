import { Input } from '../ui/input';

interface Props {
  value?: string;
  onValueChange?: (input: string) => void;
  max?: number;
  placeholder?: string;
}
const SerialInput = ({ value, onValueChange, max, placeholder }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onValueChange) {
      return;
    }
    if (!max) {
      onValueChange(e.target.value.toUpperCase());
      return;
    }

    if (e.target.value.length <= max) {
      onValueChange(e.target.value.toUpperCase());
      return;
    }
    onValueChange(e.target.value.slice(0, max).toUpperCase());
  };

  return (
    <div className="relative">
      <Input
        className="rounded-none focus-visible:border-neutral-400 focus-visible:ring-0 
  focus-visible:ring-offset-0 dark:focus-visible:border-neutral-600"
        onChange={e => handleChange(e)}
        value={value}
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 mr-[1px] flex items-center">
        <p
          className="bg-white px-3 text-xs font-light text-neutral-500 dark:bg-neutral-950 
          dark:text-neutral-400"
          id="counter-text"
        >
          {value?.length ?? 0}/{max}
        </p>
      </div>
    </div>
    //     <Input
    //       className={`rounded-none focus-visible:border-neutral-400 focus-visible:ring-0
    //   focus-visible:ring-offset-0 dark:focus-visible:border-neutral-600`}
    //       onChange={e => handleChange(e)}
    //       value={value}
    //       placeholder={placeholder}
    //     />
  );
};
export default SerialInput;
