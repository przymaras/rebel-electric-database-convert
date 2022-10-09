import type { Request, Response } from "express";
import type { MysqlError } from "mysql";

import mysql from "mysql";

import type { IOldUser } from "../types/oldDb/user";

import { mapUsers } from "../mappingFunctions/mapUsers";

export const usersRoute = async (req: Request, res: Response) => {
  try {
    const rebelDb = mysql.createConnection({
      host: "mn30.webd.pl",
      user: `${process.env.SQL_USER}`,
      password: `${process.env.SQL_PASSWORD}`,
      database: `${process.env.SQL_DATABASE}`,
    });

    rebelDb.connect(function (err) {
      if (err) throw err;
      rebelDb.query(`SELECT * FROM user`, function (err: MysqlError, oldUsers: IOldUser[]) {
        if (err) throw err;

        rebelDb.end(function (err) {
          if (err) throw err;
        });

        const newUser = mapUsers(oldUsers);

        return res.status(200).json(newUser.slice(0, 9));
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
