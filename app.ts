// These import necessary modules and set some initial variables
import dotenv from "dotenv";
import express from "express";
import type { Express, Request, Response } from "express";
import mysql from "mysql";
import type { MysqlError } from "mysql";
import rateLimit from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import util from "util";
import ImageKit from "imagekit";
import { IOldUser } from "./src/types/oldDb/user";
import { IOldVehicle } from "./src/types/oldDb/vehicle";
import { mapUsers } from "./src/mappingFunctions/mapUsers";
import { mapVehicles } from "./src/mappingFunctions/mapVehicles";
import { IList } from "./src/types/oldDb/list";
import { l_brake_type } from "./src/types/oldDb/l_brake";
import { IProductPhoto } from "./src/types/oldDb/product_photo";
import { l_battery_instal_type } from "./src/types/oldDb/l_battery_install";
import { l_accumulator_type } from "./src/types/oldDb/l_accumulator";
import { errorImages1 } from "./src/uploadResults1";

dotenv.config();

const app = express();
const port = 3030;

// Rate limiting - limits to 1/sec

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 5 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Allow CORS from any origin
app.use(cors());

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes

// Test route, visit localhost:3000 to confirm it's working
// should show 'Hello World!' in the browser
app.get("/", (req, res) => res.send("Hello World!"));

// Our endpoint
app.get("/upload-vehicle-images", async (req, res) => {
  const conn = mysql.createConnection({
    host: "mn30.webd.pl",
    user: `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`,
  });

  const query = util
    .promisify<string | mysql.QueryOptions, { id: number; product_id: number }[]>(conn.query)
    .bind(conn);

  const imagekit: ImageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: "https://ik.imagekit.io/rebelelectric/",
  });

  try {
    const uploadedImages: number[] = [];
    const errorImages: number[] = [];
    const photos = await query(`SELECT * FROM product_photo`);
    conn.end();

    const photosIds = photos.map((photo) => photo.id);

    await Promise.allSettled(
      photosIds.map((photoId) => {
        return imagekit
          .upload({
            file: `https://bikel.pl/rebel/${photoId}`, //required
            fileName: `v1-${photoId}.jpg`, //required
            folder: "/v1",
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
});

app.get("/upload-vehicle-images-retry", async (req, res) => {
  const imagekit: ImageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: "https://ik.imagekit.io/rebelelectric/",
  });

  try {
    const uploadedImages: number[] = [];
    const errorImages: number[] = [];

    await Promise.allSettled(
      errorImages1.map((photoId) => {
        return imagekit
          .upload({
            file: `https://bikel.pl/rebel/${photoId}`, //required
            fileName: `v1-${photoId}.jpg`, //required
            folder: "/v1",
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
});

app.get("/users", async (req, res) => {
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
});

app.get("/vehicles", async (req, res) => {
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
});

// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(port, () => console.log(`Rebel electric database convert API listens on port ${port}!`));
