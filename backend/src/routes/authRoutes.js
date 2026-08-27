const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

const loginLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });


router.post('/register', loginLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/logout', protect, logoutUser);

module.exports = router;