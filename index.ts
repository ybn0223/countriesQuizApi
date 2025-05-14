import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import APIROUTER from "./routers/api";
import { connect } from "./database/database";
import cors from "cors";
import changePopulationValue from "./database/newPopulation";

dotenv.config();

const APP : Express = express();

APP.set("view engine", "ejs");
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(express.static(path.join(__dirname, "public")));
APP.set("views", path.join(__dirname, "views"));

APP.set("port", process.env.PORT ?? 3000);

APP.use(cors({
	origin: '*', // Allow all origins
	methods: 'GET,POST,PUT,DELETE', // Allow all HTTP methods
	allowedHeaders: 'Content-Type', // Allow specific headers
  }));
  
APP.use('/api', APIROUTER);
APP.use((request, response) => {
	response.status(404).json({
		error: 'The specified path does not exist.'
	});
});
APP.listen(APP.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + APP.get("port"));
});