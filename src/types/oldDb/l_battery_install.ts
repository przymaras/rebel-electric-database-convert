export type l_battery_instal_type =
  | "Bateria Bidonowa"
  | "inne"
  | "Plecak"
  | "Skrzynka druk 3D"
  | "Skrzynka z aluminium"
  | "Skrzynka z drewna"
  | "Skrzynka z żywicy"
  | "Torba";

export type NewBatteryCaseNames =
  | "3dPrintCase"
  | "aluCase"
  | "backpack"
  | "other"
  | "resinCase"
  | "textileBag"
  | "waterBottleCase"
  | "woddenCase";

export const batteryCaseMapOldToNew: Record<l_battery_instal_type, NewBatteryCaseNames> = {
  "Bateria Bidonowa": "waterBottleCase",
  Plecak: "backpack",
  "Skrzynka druk 3D": "3dPrintCase",
  "Skrzynka z aluminium": "aluCase",
  "Skrzynka z drewna": "woddenCase",
  "Skrzynka z żywicy": "resinCase",
  Torba: "textileBag",
  inne: "other",
};
