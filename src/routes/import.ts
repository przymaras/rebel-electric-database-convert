import type { Request, Response } from "express";

import util from "util";
import mysql from "mysql";

import type { IOldUser } from "../types/oldDb/user";
import type { IList } from "../types/oldDb/list";
import type { IOldVehicle } from "../types/oldDb/vehicle";
import type { IProductPhoto } from "../types/oldDb/product_photo";
import type { l_accumulator_type } from "../types/oldDb/l_accumulator";
import type { l_battery_instal_type } from "../types/oldDb/l_battery_install";
import type { l_brake_type } from "../types/oldDb/l_brake";
import { mapUsers } from "../mappingFunctions/mapUsers";
import type { IBikeLike } from "../types/oldDb/bike_like";
import { mapVehicles } from "../mappingFunctions/mapVehicles";
import { mapOldToNewIdsInUsers } from "../mappingFunctions/mapOldToNewIdsInUsers";
import { mapOldToNewIdsInVehicles } from "../mappingFunctions/mapOldToNewIdsInVehicles";
// import { mongoDbRequest } from "../services/mongoDb/mongoDbRequest";
// import { mDbAddUsers } from "../services/mongoDb/collections";

type QueryResponseType = [
  IOldUser[],
  IBikeLike[],
  IOldVehicle[],
  IList<l_brake_type>[],
  IProductPhoto[],
  IList[],
  IList[],
  IList<l_battery_instal_type>[],
  IList<l_accumulator_type>[]
];

export const importRoute = async (req: Request, res: Response) => {
  const rebelDb = mysql.createConnection({
    host: "mn30.webd.pl",
    user: `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`,
    multipleStatements: true,
  });

  const query = util
    .promisify<string | mysql.QueryOptions, QueryResponseType>(rebelDb.query)
    .bind(rebelDb);

  try {
    const [
      oldUsers,
      bike_like,
      oldVehicles,
      l_brake,
      product_photo,
      l_base_brand,
      l_base_model,
      l_battery_install,
      l_accumulator,
    ] = await query(
      `
       SELECT * FROM user;
       SELECT * FROM bike_like;
       SELECT * FROM product; 
       SELECT * FROM l_brake; 
       SELECT * FROM product_photo; 
       SELECT * FROM l_base_brand;
       SELECT * FROM l_base_model;
       SELECT * FROM l_battery_install;
       SELECT * FROM l_accumulator;
       `
    );
    rebelDb.end();

    const newUsers = mapUsers({ oldUsers, bike_like });

    const newVehicles = mapVehicles({
      oldVehicles,
      l_brake,
      product_photo,
      l_base_brand,
      l_base_model,
      l_battery_install,
      l_accumulator,
      bike_like,
    });

    const newUsersWithNewIds = mapOldToNewIdsInUsers(newUsers, newVehicles);

    const newVehiclesWithNewIds = mapOldToNewIdsInVehicles(newUsers, newVehicles);

    // const mongoResponse = await mongoDbRequest(async (db) => {
    //   const addUsers = await mDbAddUsers(db, newUsers);
    //   return { addUsers };
    // });

    // if (!mongoResponse) {
    //   return res.status(500).json({ message: "Can't connect to mongoDb" });
    // }

    // const { addUsers } = mongoResponse;

    return res
      .status(200)
      .json({ users: newUsersWithNewIds.slice(0, 9), vehicles: newVehiclesWithNewIds.slice(0, 9) });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
