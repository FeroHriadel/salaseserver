const express = require('express');
const router = express.Router();
const { loggedInOnly, adminOnly } = require('../middleware/authMiddleware');
const { addLocation, getLocations, deleteLocation, getLocation, updateLocation } = require('../controllers/locationControllers');



router.post('/addlocation', loggedInOnly, adminOnly, addLocation);
router.get('/getlocations', getLocations);
router.get('/getlocation/:locationId', getLocation);
router.delete('/deletelocation/:locationId', loggedInOnly, adminOnly, deleteLocation);
router.put('/updatelocation/:locationId', loggedInOnly, adminOnly, updateLocation);




module.exports = router;