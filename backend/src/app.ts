import express from "express"
import morgan from "morgan"
import adminRoutes from "./routes/admin/router"

export function makeApp(): express.Application {
	const app = express()

    app.use(express.json())
	app.use(morgan("dev"))

	app.use("/admin", adminRoutes)

	return app
}
