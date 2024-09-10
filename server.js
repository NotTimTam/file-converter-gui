import "dotenv/config";
import express from "express";
import next from "next";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { error, log } from "@nottimtam/console.js";
import FileConverter from "@nottimtam/file-converter";
import modules from "@nottimtam/file-converter-core";

import pkg from "./package.json" assert { type: "json" };
const { version } = pkg;
const PORT = process.env.PORT || 80;
const dev = process.env.NODE_ENV !== "production";

// Initialize app.
const app = express();

// Configure process.exit
process.on("exit", (code) => {
	log(`Stop Code: ${code}`);
});

log(`Server Version: v${version}`);

// Load middleware.
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

const limiter = rateLimit({
	windowMs: 60000, // 1 minute.
	max: 10000, // Limit each IP to 50 requests per `window` (here, per 1 second)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// API configuration.
const apiVersion = process.env.API_VERSION || 1;
const apiRoute = `/api/v${apiVersion}`;

log(`API Version: v${apiVersion}`);

const fileConverter = new FileConverter({
	modules,
	fileSizeLimit: process.env.FILE_SIZE_LIMIT,
	temp: process.env.TEMP,
	clearJobOnDownload:
		process.env.CLEAR_JOB_ON_DOWNLOAD &&
		process.env.CLEAR_JOB_ON_DOWNLOAD === "true",
	DANGEROUSLYforceClearTemp:
		process.env.DANGEROUSLY_FORCE_CLEAR_TEMP &&
		process.env.DANGEROUSLY_FORCE_CLEAR_TEMP === "true",
});

// Use middleware and routes.
app.disable("x-powered-by");
app.use(express.json(), cors(), limiter);
app.use(apiRoute, fileConverter.middleware()); // The route on which to access the file converter.

const startup = async () => {
	nextApp.prepare().then(() => {
		app.all("*", (req, res) => handler(req, res));

		app.listen(PORT, (err) => {
			if (err) {
				error(err);
			} else {
				log(`Port: ${PORT}`);
			}
		});
	});
};

startup();
