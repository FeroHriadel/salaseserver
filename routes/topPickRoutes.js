const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addTopPick, getTopPicks, deleteTopPick } = require('../controllers/topPickControllers');



router.post('/addtoppick', loggedInOnly, adminOnly, addTopPick);
router.get('/gettoppicks', getTopPicks);
router.delete('/deletetoppick/:topPickId', loggedInOnly, adminOnly, deleteTopPick);




module.exports = router;