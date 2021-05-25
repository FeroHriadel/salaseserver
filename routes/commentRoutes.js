const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addComment, getComments, deleteComment } = require('../controllers/commentControllers');



router.post('/addcomment', loggedInOnly, addComment);
router.post('/getcomments/:hutid', getComments);
router.delete('/deletecomment/:commentId', loggedInOnly, adminOnly, deleteComment);


module.exports = router;