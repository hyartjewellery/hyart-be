
const router = require('express').Router(); 

const auth = require('../controllers/auth');
const protect = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/refresh', auth.refreshAccessToken);
router.post('/logout', auth.logout);
router.post('/sendotp', auth.sendOtp);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.post('/update-password',protect.protect , auth.updatePassword);
router.get('/get-profile', protect.protect, auth.getProfile);

module.exports = router;