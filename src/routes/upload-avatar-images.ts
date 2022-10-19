import type { Request, Response } from "express";

import mysql from "mysql";
import util from "util";
import ImageKit from "imagekit";

import { throttledPromises } from "../utils/promiseThrottling";

export const uploadAvatarImages = async (req: Request, res: Response) => {
  const rebelDb = mysql.createConnection({
    host: "mn30.webd.pl",
    user: `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`,
  });

  const query = util
    .promisify<string | mysql.QueryOptions, { id: number }[]>(rebelDb.query)
    .bind(rebelDb);

  const imagekit: ImageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: "https://ik.imagekit.io/rebelelectric/",
  });

  try {
    const users = await query(`SELECT * FROM user`);
    rebelDb.end();

    const userIds = users.map((photo) => photo.id);

    const isProduction = Boolean(req.query.production);
    const prefix = isProduction ? "avatar" : "dev-avatar";
    const folder = isProduction ? "/avatars" : "/development";

    const upload = async (photoId: string) => {
      return new Promise((resolve, reject) =>
        imagekit
          .upload({
            file: `https://rebel-electric.com/new/avatar/${photoId}.jpg`,
            fileName: `${prefix}-v1-${photoId}.jpg`,
            folder: folder,
            useUniqueFileName: false,
          })
          .then(() => resolve(photoId))
          .catch(() => reject(photoId))
      );
    };

    const results = await throttledPromises(upload, userIds, 10, 5);

    const errorImages = results
      .filter((result) => result.status === "rejected")
      .map((result) => result?.reason ?? 0);

    const successImages = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result?.value ?? 0);

    return res.status(200).json({ message: "Upload complete.", successImages, errorImages });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
