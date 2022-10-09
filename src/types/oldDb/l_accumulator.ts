export type l_accumulator_type =
  | "Ogniwa Li-Ion 18650"
  | "Li-Ion (samochodowy)"
  | "Li-Pol"
  | "LiFePo"
  | "Kwasowy"
  | "Li-Ion (inny)";

type NewCellsType = "liIon" | "liPo" | "liFePo4" | "leadAcid" | "leadGel" | "leadAgm" | "other";

export const cellsTypeMapOldToNew: Record<l_accumulator_type, NewCellsType> = {
  Kwasowy: "leadAcid",
  "Li-Ion (inny)": "liIon",
  "Li-Ion (samochodowy)": "liIon",
  "Li-Pol": "liPo",
  LiFePo: "liFePo4",
  "Ogniwa Li-Ion 18650": "liIon",
};
