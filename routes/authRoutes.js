const express = require('express');
const router = express.Router();
const { signup, signin, signout, forgotPassword, resetPassword, preSignup, getGoogleClientId, googleSignin } = require('../controllers/authControllers');
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');



router.get('/protected', loggedInOnly, adminOnly, (req, res) => {res.json({user: req.user})});
router.post('/presingup', preSignup)
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.put('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/getgoogleclientid', getGoogleClientId);
router.post('/googlesignin', googleSignin);




module.exports = router;


