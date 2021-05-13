const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../controllers/authControllers');
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');



router.get('/protected', loggedInOnly, adminOnly, (req, res) => {res.json({user: req.user})})
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);



module.exports = router;


