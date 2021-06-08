const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addComment, getComments, deleteComment, getNumberOfComments } = require('../controllers/commentControllers');



router.post('/addcomment', loggedInOnly, addComment);
router.post('/getcomments/:hutid', getComments);
router.delete('/deletecomment/:commentId', loggedInOnly, adminOnly, deleteComment);
router.delete('/deletecomment/:commentId', loggedInOnly, adminOnly, deleteComment);
router.get('/getnumberofcomments/:hutid', getNumberOfComments);


module.exports = router;