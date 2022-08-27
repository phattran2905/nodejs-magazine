import mongoose from "mongoose"

export function connectDb() {
	const { DATABASE_URI } = process.env
	mongoose.connect(DATABASE_URI ?? "mongodb://localhost:27017")

	mongoose.connection.once("connected", () =>
		console.log("[MongoDB] Connection has been established successfully.")
	)
	mongoose.connection.on("error", (error) =>
		console.error("[MongoDB] Unable to connect to the database:", error)
	)
}
