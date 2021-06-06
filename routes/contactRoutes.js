const express = require('express');
const router = express.Router();
const { sendForm} = require('../controllers/contactControllers');

router.post('/sendform', sendForm);

module.exports = router;