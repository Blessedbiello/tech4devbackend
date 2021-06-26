import express from 'express';
import { register, login, allusers } from '../controllers/auth';

import router from express.Router();

import { protect } from '../middleware/auth';

router.post('/register', register);
router.post('/login', login);
router.get('/allusers', protect, allusers)

module.exports = router;