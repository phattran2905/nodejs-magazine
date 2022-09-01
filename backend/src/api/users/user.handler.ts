import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { Users, User, UserWithId } from './user.model'

export async function findAll(
  req: Request,
  res: Response<UserWithId[]>,
  next: NextFunction
) {
  try {
    const users = await Users.find({})
    res.status(200).json([])
  } catch (error) {
    next(error)
  }
}

export async function findOne(
  req: Request<ParamsWithId, UserWithId, {}>,
  res: Response<UserWithId>,
  next: NextFunction
) {
  try {
    const user = await Users.findOne({ _id: new ObjectId(req.params.id) })

    if (!user) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found.`)
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function createOne(
  req: Request<{}, UserWithId, User>,
  res: Response<UserWithId>,
  next: NextFunction
) {
  try {
    const insertResult = await Users.insertOne(req.body)
    if (!insertResult.acknowledged) throw new Error('Error inserting user.')

    const user = {
      _id: insertResult.insertedId,
      username: req.body.username,
      email: req.body.email,
      token: 'token',
    }

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, UserWithId, User>,
  res: Response<UserWithId>,
  next: NextFunction
) {
  try {
    const result = await Users.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: req.body,
      },
      { returnDocument: 'after' }
    )
    if (!result.value) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found`)
    }
    res.status(200).json(result.value)
  } catch (error) {
    next(error)
  }
}

export async function deleteOne(
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await Users.findOneAndDelete({ _id: new ObjectId(req.params.id) })
    if (!result.value) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found`)
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
