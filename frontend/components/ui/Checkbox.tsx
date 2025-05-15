import { twMerge } from "tailwind-merge";
import { IconSymbol } from "./IconSymbol";

interface Props {
  size?: number;
  checked: boolean;
}

export function Checkbox({ checked }: Props) {
  return (
    <IconSymbol
      className={twMerge(
        checked ? "text-primary" : "text-base-content",
        "size-6",
      )}
      name={checked ? "checkmark.circle.fill" : "circle"}
    />
  );
}
