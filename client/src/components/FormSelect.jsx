/* eslint-disable react/prop-types */
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  showLabel = true,
  children,
  options,
  className,
}) {
  return (
    <div className="grid w-full items-center gap-1.5">
      {showLabel && <Label htmlFor={id}>{label}</Label>}
      <div className={className}>
        <Select
          id={id}
          value={value}
          onValueChange={onChange}
          required={required}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Seleziona un opzione</SelectLabel>
              {options?.map((option, i) => (
                <SelectItem key={i} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {children && children}
      </div>
    </div>
  );
}
