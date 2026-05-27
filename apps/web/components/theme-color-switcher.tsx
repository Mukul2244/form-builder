"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const STORAGE_KEY = "theme-color";

const COLOR_OPTIONS = [
  { value: "green", label: "Green", swatchClass: "bg-emerald-500" },
  { value: "blue", label: "Ocean", swatchClass: "bg-sky-500" },
  { value: "amber", label: "Amber", swatchClass: "bg-amber-500" },
  { value: "rose", label: "Rose", swatchClass: "bg-rose-500" },
];

export function ThemeColorSwitcher() {
  const [color, setColor] = React.useState("green");

  React.useEffect(() => {
    const docTheme = document.documentElement.getAttribute("data-theme");
    const saved = window.localStorage.getItem(STORAGE_KEY) || docTheme || "green";
    setColor(saved);
    document.documentElement.setAttribute("data-theme", saved);
    window.localStorage.setItem(STORAGE_KEY, saved);
  }, []);

  const applyColor = (value: string) => {
    setColor(value);
    document.documentElement.setAttribute("data-theme", value);
    window.localStorage.setItem(STORAGE_KEY, value);
    document.cookie = `theme-color=${value}; path=/; max-age=31536000`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch theme color">
          <Palette className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Theme color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COLOR_OPTIONS.map((option) => {
          const isActive = option.value === color;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => applyColor(option.value)}
              className={cn("flex items-center gap-2", isActive && "bg-accent text-accent-foreground")}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", option.swatchClass)} />
              <span>{option.label}</span>
              {isActive && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
