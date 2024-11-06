const express = require('express');
const { signup, login, doctorLogin } = require('../controller/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/doctor-login', doctorLogin);

module.exports = router;
