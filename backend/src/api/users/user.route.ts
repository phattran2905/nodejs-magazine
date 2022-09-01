import { Router } from 'express'
import * as UserHandlers from './user.handler'
import { validateRequest } from '../../middlewares'
import { User } from './user.model'
import { ParamsWithId } from '../../interfaces/ParamsWithId'

const router = Router()

router.get('/', UserHandlers.findAll)
router.get('/:id', validateRequest({ params: ParamsWithId }), UserHandlers.findOne)
router.post('/', validateRequest({ body: User }), UserHandlers.createOne)
router.put('/:id', validateRequest({ params: ParamsWithId }), UserHandlers.updateOne)
router.delete('/:id', validateRequest({ params: ParamsWithId }), UserHandlers.deleteOne)

export default router
