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
import { mapUsers } from "../utils/mapUsers";
import type { IBikeLike } from "../types/oldDb/bike_like";
import { mapVehicles } from "../utils/mapVehicles";
import { mapOldToNewIdsInUsers } from "../utils/mapOldToNewIdsInUsers";
import { mapOldToNewIdsInVehicles } from "../utils/mapOldToNewIdsInVehicles";
import { mongoDbRequest } from "../services/mongoDb/mongoDbRequest";
import { mDbAddUsers, mDbAddVehicles } from "../services/mongoDb/collections";
import { getVehiclesWithNoImages } from "../utils/getVehiclesWithNoImages";

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
  const isProduction = Boolean(req.query.production);

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

    const newUsers = mapUsers({ isProduction, oldUsers, bike_like });

    const newVehicles = mapVehicles({
      isProduction,
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

    const vehiclesWithNoImages = getVehiclesWithNoImages(newVehiclesWithNewIds);

    const newVehiclesWithPhotos = newVehiclesWithNewIds.filter(
      (vehicle) =>
        !vehiclesWithNoImages.some((noImageVehicle) => noImageVehicle._id === vehicle._id)
    );

    const newUsersWithoutExcessLikes = newUsersWithNewIds.map((user) => ({
      ...user,
      likedVehicles: user.likedVehicles.filter(
        (likedId) =>
          !vehiclesWithNoImages.some((vehicleWithNoImage) => vehicleWithNoImage._id === likedId)
      ),
    }));

    if (req.query.update) {
      const mongoResponse = await mongoDbRequest(async (db) => {
        const addUsers = await mDbAddUsers(db, newUsersWithoutExcessLikes);
        const addVehicles = await mDbAddVehicles(db, newVehiclesWithPhotos);
        return { addUsers, addVehicles };
      });

      if (!mongoResponse) {
        return res.status(500).json({ message: "Can't connect to mongoDb" });
      }

      const { addUsers, addVehicles } = mongoResponse;

      console.info("update DB");
    } else {
      console.info("preview only");
    }

    return res.status(200).json({
      vehiclesWithNoImages: vehiclesWithNoImages,
      users: newUsersWithoutExcessLikes.slice(0, 9),
      vehicles: newVehiclesWithPhotos.slice(0, 9),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
