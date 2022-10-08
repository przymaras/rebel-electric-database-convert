// These import necessary modules and set some initial variables
import dotenv from "dotenv";
import express from "express";
import type { Express, Request, Response } from "express";
import mysql from "mysql";
import type { MysqlError } from "mysql";
import rateLimit from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { IOldUser } from "./src/types/oldDb/user";
import { IUser } from "./src/types/user";
import { IOldVehicle } from "./src/types/oldDb/vehicle";
import { mapUsers } from "./src/mappingFunctions/mapUsers";
import { mapVehicles } from "./src/mappingFunctions/mapVehicles";
import { IList } from "./src/types/oldDb/list";

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

      type VehiclesResponseType = [IOldVehicle[], IList[]];

      rebelDb.query(
        // `SELECT product.*, l_brake.name as brakeName FROM product CROSS JOIN l_brake ON product.brake_id=l_brake.id`,
        `SELECT * FROM product; SELECT * FROM l_brake`,
        function (err: MysqlError, [oldVehicles, l_brake]: VehiclesResponseType) {
          if (err) throw err;

          rebelDb.end(function (err) {
            if (err) throw err;
          });

          const vehicles = mapVehicles({ oldVehicles, l_brake });

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
