type l_engine_name_type = "HUB tył" | "HUB przód" | "MID drive" | "HUB przód + tył";

export interface IOldEngine {
  id: number;
  name: l_engine_name_type;
  hub: 0 | 1;
  mid: 0 | 1;
  factory: 0 | 1;
  emoto: 0 | 1;
  monster: 0 | 1;
  other: 0 | 1;
}

export type EngineKindType = keyof Omit<IOldEngine, "id" | "name">;

export const engineKinds: EngineKindType[] = ["emoto", "factory", "hub", "mid", "monster", "other"];

export interface IOldEngineBrand {
  id: number;
  name: string;
  kind: EngineKindType;
  active: 0 | 1;
  user_id: 0;
}

export interface IOldEngineModel {
  id: number;
  brand_id: number;
  name: string;
  active: 0 | 1;
}
