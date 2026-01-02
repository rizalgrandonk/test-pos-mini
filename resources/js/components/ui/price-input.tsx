import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import CurrencyInput from "react-currency-input-field";
import { InputGroup, InputGroupAddon, InputGroupText } from "./input-group";

type PriceInputProps = ComponentProps<typeof CurrencyInput> & {
  value?: string;
  id?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  currencySymbol?: string;
};

export default function PriceInput({
  value,
  id,
  onChange = () => undefined,
  placeholder,
  currencySymbol = "Rp",
  className,
  defaultValue,
  step,
  ...props
}: PriceInputProps) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>{currencySymbol}</InputGroupText>
      </InputGroupAddon>
      <CurrencyInput
        id={id}
        placeholder={placeholder}
        data-slot="input-group-control"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0",
          className,
        )}
        value={value}
        onValueChange={(val) => onChange(val ?? "")}
        decimalSeparator=","
        groupSeparator="."
        step={Number(step)}
        defaultValue={defaultValue?.toString()}
        {...props}
      />
    </InputGroup>
  );
}
