import express from "express"
import morgan from "morgan"

export function makeApp(): express.Application {
	const app = express()

	app.use(morgan("dev"))

    return app
}
