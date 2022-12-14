import { Router } from 'express';
import * as homeController from './home.controller';
const router = Router();
router.get('/contact', homeController.showContactPage);
export default router;
