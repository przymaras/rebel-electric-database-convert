import type { Request, Response } from "express";
import type { MysqlError } from "mysql";

import mysql from "mysql";
import util from "util";
import ImageKit from "imagekit";

export const uploadVehicleImages = async (req: Request, res: Response) => {
  const rebelDb = mysql.createConnection({
    host: "mn30.webd.pl",
    user: `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`,
  });

  const query = util
    .promisify<string | mysql.QueryOptions, { id: number; product_id: number }[]>(rebelDb.query)
    .bind(rebelDb);

  const imagekit: ImageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: "https://ik.imagekit.io/rebelelectric/",
  });

  try {
    const uploadedImages: number[] = [];
    const errorImages: number[] = [];
    const photos = await query(`SELECT * FROM product_photo`);
    rebelDb.end();

    const photosIds = photos.map((photo) => photo.id);

    await Promise.allSettled(
      photosIds.map((photoId) => {
        return imagekit
          .upload({
            file: `https://bikel.pl/rebel/${photoId}`, //required
            fileName: `dev-v1-${photoId}.jpg`, //required
            folder: "/development",
            useUniqueFileName: false,
          })
          .then(() => {
            uploadedImages.push(photoId);
            console.info(`Uploaded: ${photoId}`);
          })
          .catch(() => {
            errorImages.push(photoId);
            console.error(`Error upload: ${photoId}`);
          });
      })
    );

    errorImages.sort((a, b) => a - b);
    uploadedImages.sort((a, b) => a - b);

    return res.status(200).json({ message: "Upload results", errorImages, uploadedImages });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
