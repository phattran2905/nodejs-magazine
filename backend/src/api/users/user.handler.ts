import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Users, User, UserWithId } from './user.model'

export function findAll(req, res, next) {
	res.status(200).json([])
}
export function findOne(req, res, next) {}

export async function createOne(
	req: Request<{}, UserWithId, User>,
	res: Response<UserWithId>,
	next: NextFunction
) {
	try {
        console.log(req.body)
        const user = await User.parse(req.body)
		// const insertResult = await Users.insertOne(req.body)
		// if (!insertResult.acknowledged) throw new Error('Error inserting user.')

		res.status(201)
		res.json({
			// _id: insertResult.insertedId,
			// ...req.body,
            ...user
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}

export function updateOne(req, res, next) {}
export function deleteOne(req, res, next) {}
