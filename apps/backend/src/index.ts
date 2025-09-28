import "dotenv/config";
import { GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import coverLetterRoute from "./routes/cover-letter";
import jobPostingRoute from "./routes/job-posting";
import userRoute from "./routes/user";

const app = new Hono().basePath("/api");

app.use(
	"*",
	cors({
		origin: "*", 
		credentials: true, 
		exposeHeaders: ["Content-Disposition"],
		allowHeaders: ["*"], 
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	}),
);
app.use(logger());

app.route("/job-posting", jobPostingRoute);
app.route("/user", userRoute);
app.route("/cover-letter", coverLetterRoute);

app.onError((err, c) => {
	console.log(err);
	if (err instanceof GoogleGenerativeAIFetchError) {
		return c.json(
			{ error: `Error happened by Gemini, ${err.statusText}` },
			500,
		);
	}
	if (err instanceof HTTPException) {
		if (err.status >= 500) {
			return c.json({ error: "Internal Server Error, Try again later" }, 500);
		}
		return c.json({ error: err.message }, err.status);
	}
	return c.json({ error: "Internal Server Error, Try again later" }, 500);
});

const server = serve(
	{
		fetch: app.fetch,
		port: 3008,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}/api`);
	},
);

// graceful shutdown
process.on("SIGINT", () => {
	server.close();
	process.exit(0);
});
process.on("SIGTERM", () => {
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
