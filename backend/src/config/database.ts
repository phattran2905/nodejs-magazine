import mongoose from "mongoose"

export async function connectDb() {
	try {
		const { DATABASE_URI } = process.env
		const connected = await mongoose.connect(DATABASE_URI ?? "mongodb://localhost:27017")
		console.log("[MongoDB] Connection has been established successfully.")
	} catch (error) {
		console.error("[MongoDB] Unable to connect to the database:", error)
	}
}
