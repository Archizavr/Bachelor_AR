import express from 'express';
import { authUser } from './auth.controller.js';

const router = express.Router();

router.get('/auth', authUser);

export default router;