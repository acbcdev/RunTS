import { Button } from "@/features/ui/button";

export interface SettingButtonGroupProps<T> {
  options: T[];
  value: number | string;
  onChange: (value: T) => void;
  renderLabel?: (option: T) => string;
  onValue?: (option: T) => string | number;
  className?: string;
  buttonStyle?: (option: T) => React.CSSProperties;
}

export function SettingButtonGroup<
  T extends string | number | { toString(): string },
>({
  options,
  value,
  onChange,
  onValue,
  renderLabel = (option) => String(option),
  className = "grid grid-cols-8 gap-2 md:grid-cols-8",
  buttonStyle,
}: SettingButtonGroupProps<T>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <Button
          key={String(option)}
          variant={
            value === (onValue?.(option) || option)
              ? "borderSettings"
              : "outline"
          }
          onClick={() => onChange(option)}
          style={buttonStyle?.(option)}
        >
          {renderLabel(option)}
        </Button>
      ))}
    </div>
  );
}
