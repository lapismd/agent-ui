import { Palette, SunMoon, Type, Columns2 } from "@lucide/svelte";
import type { Component } from "svelte";
export const settingsRowIcons: Readonly<Record<string, Component>> = {
  "Color mode": SunMoon,
  "Theme style": Palette,
  "Accent color": Palette,
  "Prominent active tab": Columns2,
  "Text size": Type,
  "Conversation style": Columns2,
  "Message spacing": Columns2,
};
