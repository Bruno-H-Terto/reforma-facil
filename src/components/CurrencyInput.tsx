import { NumericFormat } from "react-number-format";

type CurrencyInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  className: string;
  required?: boolean;
  "aria-describedby"?: string;
};

export function CurrencyInput({
  value,
  onValueChange,
  ...props
}: CurrencyInputProps) {
  return (
    <NumericFormat
      {...props}
      type="text"
      inputMode="decimal"
      value={value}
      valueIsNumericString
      prefix="R$ "
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      isAllowed={({ floatValue }) =>
        floatValue === undefined || floatValue <= 100000000000
      }
      onValueChange={(values, { source }) => {
        if (source === "event") onValueChange(values.value);
      }}
    />
  );
}
