/* eslint-disable react/prop-types */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FormInput({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  autoComplete = true,
  required = false,
  showLabel = true,
  children,
  className,
}) {
  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      {showLabel && <Label htmlFor={id}>{label}</Label>}
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        name={id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete ? "on" : "off"}
        required={required}
      />
      {children && children}
    </div>
  );
}
