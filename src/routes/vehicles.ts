import type { Request, Response } from "express";
import type { MysqlError } from "mysql";

import mysql from "mysql";

import type { IList } from "../types/oldDb/list";
import type { IOldVehicle } from "../types/oldDb/vehicle";
import type { IProductPhoto } from "../types/oldDb/product_photo";
import type { l_accumulator_type } from "../types/oldDb/l_accumulator";
import type { l_battery_instal_type } from "../types/oldDb/l_battery_install";
import type { l_brake_type } from "../types/oldDb/l_brake";
import { mapVehicles } from "../mappingFunctions/mapVehicles";

export const vehiclesRoute = async (req: Request, res: Response) => {
  try {
    const rebelDb = mysql.createConnection({
      host: "mn30.webd.pl",
      user: `${process.env.SQL_USER}`,
      password: `${process.env.SQL_PASSWORD}`,
      database: `${process.env.SQL_DATABASE}`,
      multipleStatements: true,
    });

    rebelDb.connect(function (err) {
      if (err) throw err;

      type VehiclesResponseType = [
        IOldVehicle[],
        IList<l_brake_type>[],
        IProductPhoto[],
        IList[],
        IList[],
        IList<l_battery_instal_type>[],
        IList<l_accumulator_type>[]
      ];

      rebelDb.query(
        // `SELECT product.*, l_brake.name as brakeName FROM product CROSS JOIN l_brake ON product.brake_id=l_brake.id`,
        `SELECT * FROM product; 
        SELECT * FROM l_brake; 
        SELECT * FROM product_photo; 
        SELECT * FROM l_base_brand;
        SELECT * FROM l_base_model;
        SELECT * FROM l_battery_install;
        SELECT * FROM l_accumulator;
        `,
        function (
          err: MysqlError,
          [
            oldVehicles,
            l_brake,
            product_photo,
            l_base_brand,
            l_base_model,
            l_battery_install,
            l_accumulator,
          ]: VehiclesResponseType
        ) {
          if (err) throw err;

          rebelDb.end(function (err) {
            if (err) throw err;
          });

          const vehicles = mapVehicles({
            oldVehicles,
            l_brake,
            product_photo,
            l_base_brand,
            l_base_model,
            l_battery_install,
            l_accumulator,
          });

          return res.status(200).json(vehicles.slice(0, 9));
        }
      );
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
