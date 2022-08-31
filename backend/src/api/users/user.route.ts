import { Router } from 'express'
import * as UserHandlers from './user.handler'

const router = Router()

router.get('/', UserHandlers.findAll)
router.get('/:id', UserHandlers.findOne)
router.post('/', UserHandlers.createOne)
router.put('/:id', UserHandlers.updateOne)
router.delete('/:id', UserHandlers.deleteOne)

export default router
