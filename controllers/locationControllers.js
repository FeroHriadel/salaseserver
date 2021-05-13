const Location = require('../models/locationModel');



//CREATE LOCATION
exports.addLocation = async (req, res) => {
    try {
        const { name, image, maxLong, minLong, maxLat, minLat } = req.body;
        if (!name || !image.url || !maxLong || !minLong || !maxLat || !minLat) {
            return res.status(400).json({error: `All parameters (including image) are required`});
        }

        const location = new Location({
            name,
            image,
            maxLong,
            minLong,
            maxLat,
            minLat
        });

        locationAlreadyExists = await Location.findOne({name});
        if (locationAlreadyExists) {
            return res.status(400).json({error: 'Location with the same name already exists'});
        }

        const createdLocation = await location.save();
        if (!createdLocation) {
            return res.status(500).json({error: `Location could not be saved`});
        }

        res.status(201).json(createdLocation);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server Error (addLocation)`});
    }
}



//GET ALL LOCATIONS
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find({}).sort([['name', 'asc' ]]);
        if (!locations) {
            return res.status(404).json({error: `Locations could not be found`});
        }

        res.json(locations);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error`});
    }
}



//DELETE LOCATION
exports.deleteLocation = (req, res) => {
    try {
        const locationId = req.params.locationId;
        if (!locationId) {
            return res.status(400).json({error: `No locationId in params`});
        }

        Location.findByIdAndRemove(locationId).exec((err, success) => {
            if (err) {
                console.log(err);
                return res.status(404).json({error: `Location could not be deleted`});
            }

            res.json({message: `Location Deleted`});
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error`})
    }
}



//GET LOCATION BY ID
exports.getLocation = (req, res) => {
    try {
        const locationId = req.params.locationId;
        if (!locationId) {
            return res.status(400).json({error: `No locationId param`});
        }

        Location.findById(locationId).exec((err, location) => {
            if (err || !location) {
                return res.status(404).json({error: `Location not found`});
            }

            res.json(location);
        })
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getLocation)`})
    }
}



//UPDATE LOCATION
exports.updateLocation = async (req, res) => {
    try {
        const { name, image, maxLong, minLong, maxLat, minLat } = req.body;
        let newValues = {};
        if (name) newValues.name = name;
        if (image) newValues.image = image;
        if (maxLong) newValues.maxLong = maxLong;
        if (minLong) newValues.minLong = minLong;
        if (maxLat) newValues.maxLat = maxLat;
        if (minLat) newValues.minLat = minLat;

        let location = await Location.findById(req.params.locationId);
        if (!location) {
            return res.status(404).json({error: `Location not found`});
        }

        location = await Location.findByIdAndUpdate(req.params.locationId, {$set: newValues}, {new: true});
        res.json(location);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (updateLocation)`})
    }
}

