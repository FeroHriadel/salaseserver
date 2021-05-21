const express = require("express");
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { uploadImages, removeImage } = require("../controllers/cloudinaryControllers");

router.post("/uploadimages", loggedInOnly, adminOnly, uploadImages);
router.delete("/removeimage/:public_id/", loggedInOnly, adminOnly, removeImage);

module.exports = router;
