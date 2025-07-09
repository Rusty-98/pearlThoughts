import express from 'express';
import { getStatus, sendEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-email', sendEmail);
router.get('/status/:id', getStatus);

export default router;
