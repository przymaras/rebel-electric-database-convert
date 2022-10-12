import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";

dotenv.config();

import { uploadVehicleImages } from "./src/routes/upload-vehicle-images";
import { uploadVehicleImagesRetry } from "./src/routes/upload-vehicle-images-retry";
import { importRoute } from "./src/routes/import";

const app = express();
const port = 3030;

// Rate limiting - limits to 1/sec
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
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/upload-vehicle-images", uploadVehicleImages);

app.get("/upload-vehicle-images-retry", uploadVehicleImagesRetry);

app.get("/import", importRoute);

// This spins up our sever and generates logs for us to use.
app.listen(port, () => console.log(`Rebel electric database convert API listens on port ${port}!`));
