import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { search } from '../controllers/etfController.js';

const router = express.Router();

router.get('/search', requireAuth, search);


export default router