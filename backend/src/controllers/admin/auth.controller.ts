import { RequestHandler } from "express"
import { User } from "../../models/user.model"

export async function login(req, res, next): Promise<RequestHandler> {
	try {
		const users = await User.find()
        console.log(users)
		return res.status(200).send("OK")
	} catch (error) {
		return res.status(400).send("error")
	}
}

export function logout(req, res, next): RequestHandler {
    return res.status(200).send("Logout")
}