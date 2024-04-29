/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AvatarDisplay({
  src,
  alt,
  fallbackText,
  fallbackColor,
  size,
  className,
}) {
  return (
    <Avatar
      className={cn(`w-${size} h-${size} bg-${fallbackColor}`, className)}
    >
      <AvatarImage
        src={src}
        alt={alt}
        className="object-cover"
      />
      <AvatarFallback className="font-bold">{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
