import { RequestHandler } from "express"
import { HydratedDocument } from "mongoose"
import { randomId } from "../../../util/random.util"
import { User, IUser } from "../../models/user.model"

export function getUsers() {}

export function getUserById() {}

export async function createUser(req, res, next): Promise<RequestHandler> {
	try {
        console.log(req.body)
		const user: HydratedDocument<IUser> = new User({
            id: "randomId()",
			email: "jennie@email.com",
			password: "1234",
			username: "jennie",
		})

		await user.save()

		return res.status(200).send(user)
	} catch (error) {
        console.log(error)
		return res.status(400).send("error")
	}
}

export function updateUserById() {}

export function deleteUserById() {}
