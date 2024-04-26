/* eslint-disable react/prop-types */
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DropdownComponent({ triggerLabel, options, children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline">{triggerLabel || "Open"}</Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options?.map((option, index) => (
          <React.Fragment key={index}>
            {option.type === "label" && (
              <DropdownMenuLabel>{option.label}</DropdownMenuLabel>
            )}
            {option.type === "separator" && <DropdownMenuSeparator />}
            {option.type === "group" && (
              <DropdownMenuGroup>
                {option.items.map((item, idx) => (
                  <DropdownMenuItem key={idx} onClick={item.onClick}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}
            {option.type === "subMenu" && (
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                    <span>{option.label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {option?.items.map((item, idx) => (
                        <DropdownMenuItem key={idx} onClick={item.onClick} disabled={item.disabled}>
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
