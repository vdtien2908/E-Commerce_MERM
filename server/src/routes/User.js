const router = require('express').Router();

const UserController = require('../http/controllers/UserController');

router.post('/register', UserController.register);

module.exports = router;
