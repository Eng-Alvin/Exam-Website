const router = require('express').Router();
const { register, login, getMe, updateProfile, updatePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);

module.exports = router;
