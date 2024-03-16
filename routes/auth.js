const express = require('express');
const router = require('express').Router(); 

const auth = require('../controllers/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/refresh', auth.refreshAccessToken);
router.post('/logout', auth.logout);
router.post('/sendotp', auth.sendOtp);

module.exports = router;