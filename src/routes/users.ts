import type { Request, Response } from "express";

import util from "util";
import mysql from "mysql";

import type { IOldUser } from "../types/oldDb/user";

import { mapUsers } from "../mappingFunctions/mapUsers";
import { mongoDbRequest } from "../services/mongoDb/mongoDbRequest";
import { mDbAddUsers } from "../services/mongoDb/collections";

export const usersRoute = async (req: Request, res: Response) => {
  const rebelDb = mysql.createConnection({
    host: "mn30.webd.pl",
    user: `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`,
  });

  const query = util
    .promisify<string | mysql.QueryOptions, IOldUser[]>(rebelDb.query)
    .bind(rebelDb);

  try {
    const oldUsers = await query(`SELECT * FROM user`);
    rebelDb.end();

    const newUsers = mapUsers(oldUsers).slice(0, 9);

    const mongoResponse = await mongoDbRequest(async (db) => {
      const addUsers = await mDbAddUsers(db, newUsers);
      return { addUsers };
    });

    if (!mongoResponse) {
      return res.status(500).json({ message: "Can't connect to mongoDb" });
    }

    const { addUsers } = mongoResponse;

    return res.status(200).json({ newUsers, addUsers });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
