type oldWheels = 0 | 18 | 20 | 21 | 24 | 26 | 27.5 | 28;

type newWheels = "20" | "24" | "26" | "27.5" | "28/29" | "18moto" | "19moto" | "other" | undefined;

export const wheelsMapOldToNew: Record<oldWheels, newWheels> = {
  0: undefined,
  18: "18moto",
  20: "20",
  21: "other",
  24: "24",
  26: "26",
  27.5: "27.5",
  28: "28/29",
};
