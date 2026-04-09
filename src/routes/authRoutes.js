
// POST /auth/register - open (no token required)
// POST /auth/login - open (no token required)
// PUT  /auth/push-token - protected (valid JWT required)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/push-token', protect, authController.savePushToken);

module.exports = router;