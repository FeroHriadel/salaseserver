const express = require("express");
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { uploadImages, removeImage } = require("../controllers/cloudinaryControllers");

router.post("/uploadimages", loggedInOnly, uploadImages);
router.delete("/removeimage/:public_id/", loggedInOnly, adminOnly, removeImage);
router.delete("/removecommentimage/:public_id/", removeImage); //same as removeimage above but no authorization => for comment images

module.exports = router;
