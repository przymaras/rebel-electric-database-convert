import type { Request, Response } from "express";

import util from "util";
import mysql from "mysql";

import { IOldController } from "../types/oldDb/l_driver";

type QueryResponseType = IOldController[];

export const controllersRoute = async (req: Request, res: Response) => {
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
    const controllers = await query(
      `
       SELECT * FROM l_driver;
       `
    );
    rebelDb.end();

    const controllerNames = controllers.map((controller) => controller.name);

    return res.status(200).json({ controllerNames });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
