import mongoose from "mongoose"
import session from 'express-session'
import ConnectMongoDbSession from "connect-mongodb-session"

// Connect to database
mongoose.connect(process.env.DATABASE_URI || "mongodb://localhost/nodejs_magazine")
mongoose.connection.once("open", () => console.log("Successfully connected to database"))
mongoose.connection.on("error", () => {
	console.error.bind(console, "connection error:")
})

const MongoDBStore = ConnectMongoDbSession(session)
const store = new MongoDBStore({
	uri: process.env.DATABASE_URI || "mongodb://localhost/nodejs_magazine",
	collection: "mySessions",
})

export { store }
