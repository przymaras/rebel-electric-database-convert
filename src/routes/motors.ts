import type { Request, Response } from "express";

import util from "util";
import mysql from "mysql";

import { engineKinds, IOldEngine, IOldEngineBrand, IOldEngineModel } from "../types/oldDb/l_engine";

type QueryResponseType = [IOldEngine[], IOldEngineBrand[], IOldEngineModel[]];

export const motorsRoute = async (req: Request, res: Response) => {
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
    const [l_engine, l_engine_brand, l_engine_model] = await query(
      `
       SELECT * FROM l_engine;
       SELECT * FROM l_engine_brand;
       SELECT * FROM l_engine_model;
       `
    );
    rebelDb.end();

    const motors = engineKinds.map((kind) => ({
      [kind]: l_engine_brand
        .filter((brand) => brand.kind === kind)
        .map((brand) => ({
          [brand.name]: l_engine_model
            .filter((model) => model.brand_id === brand.id)
            .map((model) => model.name),
        })),
    }));

    return res.status(200).json({ motors });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
