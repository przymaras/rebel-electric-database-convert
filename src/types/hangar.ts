import type { ObjectId } from "mongodb";

export interface IEBikeComplete extends Partial<IEBikeGeneral> {
  v1Id?: number;
  v1OwnerId?: string;
  v1LikedUsers?: number[];
  v1ViewsCount?: number;
  createdAt: string;
  likesCount?: string;
  likedUsers?: ObjectId[];
  viewsCount?: string;
  ownerId?: ObjectId;
}
export interface IEBikeGeneral {
  _id: ObjectId;
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
