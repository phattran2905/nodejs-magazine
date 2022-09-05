import { NextFunction, Request, response, Response } from 'express'
import { ZodError } from 'zod'
import ErrorResponse from './interfaces/ErrorResponse'
import RequestValidators from './interfaces/RequestValidators'

export function validateRequest(validators: RequestValidators) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (validators.params) {
        req.params = await validators.params?.parseAsync(req.params)
      }

      if (validators.body) {
        req.body = await validators.body?.parseAsync(req.body)
      }

      if (validators.query) {
        req.query = await validators.query?.parseAsync(req.query)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422)
      }

      next(error)
    }
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`Not Found - ${req.originalUrl}`)
  next(error)
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  const responseErr: ErrorResponse = {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? '🚩' : err.stack,
    errors: [],
  }

  if (err instanceof ZodError) {
    responseErr.errors = err.issues
    responseErr.message = 'Invalid Validation.'
  }

  res.status(statusCode)
  res.json(responseErr)
}
