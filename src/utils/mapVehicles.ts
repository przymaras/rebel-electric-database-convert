import { ObjectId } from "mongodb";
import { IEBikeComplete } from "../types/hangar";
import { IBikeLike } from "../types/oldDb/bike_like";
import { categoryMapOldToNew } from "../types/oldDb/category";
import { IList } from "../types/oldDb/list";
import { cellsTypeMapOldToNew, l_accumulator_type } from "../types/oldDb/l_accumulator";
import { batteryCaseMapOldToNew, l_battery_instal_type } from "../types/oldDb/l_battery_install";
import { l_brake_type, brakeMapOldToNew } from "../types/oldDb/l_brake";
import { IProductPhoto } from "../types/oldDb/product_photo";
import { IOldVehicle } from "../types/oldDb/vehicle";
import { overlappingVoltages } from "../types/oldDb/voltage";
import { wheelsMapOldToNew } from "../types/oldDb/wheels";

interface MapVehiclesProps {
  isProduction?: boolean;
  oldVehicles: IOldVehicle[];
  l_brake: IList<l_brake_type>[];
  product_photo: IProductPhoto[];
  l_base_brand: IList[];
  l_base_model: IList[];
  l_battery_install: IList<l_battery_instal_type>[];
  l_accumulator: IList<l_accumulator_type>[];
  bike_like: IBikeLike[];
}

export const mapVehicles = ({
  isProduction,
  oldVehicles,
  l_brake,
  product_photo,
  l_base_brand,
  l_base_model,
  l_battery_install,
  l_accumulator,
  bike_like,
}: MapVehiclesProps) => {
  return oldVehicles.map<IEBikeComplete>((oldVehicle) => {
    const brakes =
      brakeMapOldToNew[
        l_brake.find((brake) => brake.id === oldVehicle.brake_id)
          ?.name as keyof typeof brakeMapOldToNew
      ];

    const brakesOther =
      brakeMapOldToNew[
        l_brake.find((brake) => brake.id === oldVehicle.brake_id)
          ?.name as keyof typeof brakeMapOldToNew
      ] === "other"
        ? l_brake.find((brake) => brake.id === oldVehicle.brake_id)?.name ?? ""
        : undefined;

    const prefix = isProduction ? "hangar" : "dev";

    const vehicleImages = product_photo
      .filter((photo) => photo.product_id === oldVehicle.id)
      .sort((a, b) =>
        a.id === oldVehicle.main_photo_id ? -1 : b.id === oldVehicle.main_photo_id ? 1 : 0
      )
      .map((photo) => `${prefix}-v1-${photo.id}.jpg`);

    const oldBase = l_base_brand.find((brand) => brand.id === oldVehicle.brand_id)?.name.trim();
    const oldModel = l_base_model.find((model) => model.id === oldVehicle.model_id)?.name.trim();
    const oldYear = !oldModel?.includes(oldVehicle.year.toString().trim()) ? oldVehicle.year : "";
    const bikeBase = `${oldBase}${oldModel ? ` ${oldModel}` : ""}${oldYear ? ` ${oldYear}` : ""}`;

    const wheelSize = wheelsMapOldToNew[oldVehicle.wheels as keyof typeof wheelsMapOldToNew];

    const wheelOther = wheelSize === "other" ? oldVehicle.wheels.toString() : undefined;

    const batteryCase =
      batteryCaseMapOldToNew[
        l_battery_install.find((batInstall) => batInstall.id === oldVehicle.battery_install_id)
          ?.name as keyof typeof batteryCaseMapOldToNew
      ];

    const cellsType =
      cellsTypeMapOldToNew[
        l_accumulator.find((accum) => accum.id === oldVehicle.accumulator_id)
          ?.name as keyof typeof cellsTypeMapOldToNew
      ];

    const batVoltage = oldVehicle.voltage
      ? overlappingVoltages.includes(oldVehicle.voltage)
        ? oldVehicle.voltage.toString()
        : oldVehicle.voltage < 150
        ? "other"
        : undefined
      : undefined;
    const batVoltageOther = batVoltage === "other" ? oldVehicle.voltage : undefined;

    let capacity: number | undefined = undefined;
    let capacityUnit: "Ah" | "Wh" | undefined = undefined;

    if (oldVehicle.aph) {
      capacity = oldVehicle.aph;
      capacityUnit = "Ah";
    } else if (!oldVehicle?.aph && oldVehicle?.wph) {
      capacity = oldVehicle.wph;
      capacityUnit = "Wh";
    }

    const v1LikedUsers = bike_like
      .filter((like) => like.bike_id === oldVehicle.id)
      .map((like) => like.user_id);

    return {
      // ctrlManuf: "",
      // ctrlManufOther: "",
      // ctrlModel: "",
      // ctrlModelOther: "",
      // motorManuf: "",
      // motorManufOther: "",
      // motorModel: "",
      // motorModelOther: "",
      _id: new ObjectId(),
      bikeBase,
      brakes,
      brakesOther,
      createdAt: oldVehicle.date_added,
      description: oldVehicle.txt ? oldVehicle.txt : undefined,
      v1Id: oldVehicle.id,
      v1OwnerId: oldVehicle.user_id.toString(),
      projectName: oldVehicle.name,
      vehicleImages,
      video: oldVehicle.youtube ? oldVehicle.youtube : undefined,
      wheelSize,
      wheelOther,
      mass: oldVehicle.weight ? oldVehicle.weight : undefined,
      vmax: oldVehicle.speed ? oldVehicle.speed : undefined,
      range: oldVehicle.bike_range ? oldVehicle.bike_range : undefined,
      ctrlCurrent: oldVehicle.watage ? oldVehicle.watage : undefined,
      batteryCase,
      cellsType,
      batVoltage,
      batVoltageOther,
      capacity,
      capacityUnit,
      massUnit: "kg",
      vmaxUnit: "kph",
      rangeUnit: "km",
      category: categoryMapOldToNew[oldVehicle.kind_id as keyof typeof categoryMapOldToNew],
      v1LikedUsers,
      viewsCount: oldVehicle.views,
    };
  });
};
