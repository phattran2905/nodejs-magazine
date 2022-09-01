import { Router } from 'express'
import * as UserHandlers from './user.handler'
import { validateRequest } from '../../middlewares'
import { User } from './user.model'

const router = Router()

router.get('/', UserHandlers.findAll)
router.get('/:id', UserHandlers.findOne)
router.post('/', validateRequest({ body: User }), UserHandlers.createOne)
router.put('/:id', UserHandlers.updateOne)
router.delete('/:id', UserHandlers.deleteOne)

export default router
