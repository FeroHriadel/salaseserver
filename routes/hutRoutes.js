const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addHut, getHuts, getHut, updateHut, deleteHut } = require('../controllers/hutControllers');



router.post('/addhut', loggedInOnly, addHut);
router.get('/gethuts', getHuts);
router.get('/gethut/:hutId', getHut);
router.put('/updatehut/:hutId', loggedInOnly, adminOnly, updateHut);
router.delete('/deletehut/:hutId', loggedInOnly, adminOnly, deleteHut);



module.exports = router;