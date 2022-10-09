export type l_brake_type =
  | "tarcze hydrauliczne"
  | "tarcze mechaniczne"
  | "v-brake"
  | "hydrauliczne szczękowe"
  | "u-brake"
  | "tarczowe od skutera"
  | "tarczowe od motocykla"
  | "inne";

export type NewBrakesNames = "discHydraulic" | "discMechanic" | "vBrake" | "uBrake" | "other";

export const brakeMapOldToNew: Record<l_brake_type, NewBrakesNames> = {
  "tarcze hydrauliczne": "discHydraulic",
  "tarcze mechaniczne": "discMechanic",
  "v-brake": "vBrake",
  "u-brake": "uBrake",
  "hydrauliczne szczękowe": "other",
  "tarczowe od motocykla": "other",
  "tarczowe od skutera": "other",
  inne: "other",
};
