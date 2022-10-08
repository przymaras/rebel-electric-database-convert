import { IList } from "../types/oldDb/list";
import { IOldVehicle } from "../types/oldDb/vehicle";

interface MapVehiclesProps {
  oldVehicles: IOldVehicle[];
  l_brake: IList[];
}

export const mapVehicles = ({ oldVehicles, l_brake }: MapVehiclesProps) => {
  return oldVehicles.map((oldVehicle) => ({
    ...oldVehicle,
    brake_id: l_brake.find((brake) => brake.id === oldVehicle.brake_id)?.name,
  }));
};
