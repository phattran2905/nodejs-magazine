import path from "path"
import dotenv from "dotenv"
import { makeApp } from "./src/app"
import { connectDb } from "./src/config/database"

dotenv.config({ path: path.resolve(__dirname, "./src/config/config.env") })

connectDb()

const app = makeApp()
const PORT = process.env.PORT ?? 3999

app.listen(PORT, () => {
	console.log(`Express is running on port ${PORT}`)
})
