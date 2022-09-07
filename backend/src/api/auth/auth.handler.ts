import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Users, User, Role, Status } from '../users/user.model'
import DataResponse from '../../interfaces/DataResponse'
import { SignUpForm } from './signupForm.model'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await Users.findOne({
      email: req.body.email,
    })

    if (!user) {
      res.status(404)
      throw new Error('Email does not exist.')
    }

    const correctPassword = await bcrypt.compare(req.body.password, user.password)
    if (!correctPassword) {
      res.status(401)
      throw new Error('Incorrect password.')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = await bcrypt.hash(token, 10)

    const updateUser = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { token: hashedToken },
      },
      { projection: { password: 0, token: 0 }, returnDocument: 'after' }
    )
    if (!updateUser.value) {
      throw new Error('Can not generate accessToken')
    }

    res
      .status(200)
      .json({ data: { ...updateUser.value, accessToken: hashedToken }, message: 'OK' })
  } catch (error) {
    next(error)
  }
}

export async function signup(
  req: Request<{}, DataResponse<string>, SignUpForm>,
  res: Response<DataResponse<object>>,
  next: NextFunction
) {
  try {
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = await bcrypt.hash(token, 10)
    const user = await User.parseAsync({
      email: req.body.email,
      username: `user0${crypto.randomBytes(2).toString('hex')}`,
      password: await bcrypt.hash(req.body.password, 10),
      token,
    })

    const insertResult = await Users.insertOne(user)
    if (!insertResult.acknowledged) {
      throw new Error('Error inserting user.')
    }

    res
      .status(200)
      .json({ data: { ...req.body, accessToken: hashedToken }, message: 'OK' })
  } catch (error) {
    next(error)
  }
}
