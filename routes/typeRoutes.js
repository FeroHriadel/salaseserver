const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addType, getTypes, getType, updateType, deleteType } = require('../controllers/typeControllers');



router.post('/addtype', loggedInOnly, adminOnly, addType);
router.get('/gettypes', getTypes);
router.get('/gettype/:typeId', getType);
router.put('/updatetype/:typeId', loggedInOnly, adminOnly, updateType);
router.delete('/deletetype/:typeId', loggedInOnly, adminOnly, deleteType);



module.exports = router;