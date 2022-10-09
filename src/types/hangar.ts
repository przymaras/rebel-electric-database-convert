export interface IEBikeComplete extends Partial<IEBikeGeneral> {
  oldId: number;
  createdAt: string;
  oldOwnerId: string;
  likesCount?: string;
  likedUsers?: string[];
  viewsCount?: string;
}
export interface IEBikeGeneral {
  projectName: string;
  video: string;
  description: string;
  bikeBase: string;
  wheelSize: string;
  brakes: string;
  mass: number;
  vmax: number;
  range: number;
  totalCost: number;
  ctrlManuf: string;
  ctrlModel: string;
  ctrlCurrent: number;
  motorManuf: string;
  motorModel: string;
  batteryCase: string;
  cellsType: string;
  batVoltage: string;
  capacity: number;
  capacityUnit: string;
  vehicleImages: string[];
  category: string;
  wheelOther: string;
  brakesOther: string;
  massUnit: string;
  vmaxUnit: string;
  rangeUnit: string;
  totalCostCurrency: string;
  ctrlManufOther: string;
  ctrlModelOther: string;
  motorManufOther: string;
  motorModelOther: string;
  batteryCaseOther: string;
  cellsTypeOther: string;
  batVoltageOther: number;
}

interface IItemModel {
  _id: string;
  model: string;
  validated: boolean;
  url: string;
  categories: string[];
}

export interface ItemManufacturer {
  _id: string;
  manufacturer: string;
  url: string;
  validated: boolean;
  categories: string[];
  models: IItemModel[];
}
