const Hut = require('../models/hutModel');
const Location = require('../models/locationModel');
const Type = require('../models/typeModel');
const User = require('../models/userModel');
const TopPick = require('../models/topPickModel');



exports.addHut = async (req, res) => {
    try {
        //check required fields
        const { name, latitude, longitude, location, type, image, where, objectdescription, water, warning, addedby } = req.body;
        if (!name || !latitude || !longitude || !location || !type || !image) {
            return res.status(400).json({error: `Incomplete data`});
        }

        if (!addedby) {
            return res.status(500).json({error: `Server error. App failed to identify the user.`});
        }

        //check if GPS is within Location
        const checkLocation = await Location.findById(location);
        if (!checkLocation) {
            return res.status(404).json({error: `Location not found`});
        }

        if (
            parseFloat(latitude) > parseFloat(checkLocation.maxLat) || 
            parseFloat(latitude) < parseFloat(checkLocation.minLat) || 
            parseFloat(longitude) > parseFloat(checkLocation.maxLong) || 
            parseFloat(longitude) < parseFloat(checkLocation.minLong)) {
                return res.status(400).json({error: `Provided coordinates are outside Hut's Location range`});
        }

        //check if type exists
        const checkType = await Type.findById(type);
        if (!checkType) {
            return res.status(404).json({error: `Type not found`});
        }

        //create a virtual hut
        const hut = new Hut({
            name,
            latitude,
            longitude,
            location,
            type,
            image,
            where,
            objectdescription,
            water,
            warning,
            addedby
        });

        if (where) hut.where = where;
        if (objectdescription) hut.objectdescription = objectdescription;
        if (water) hut.water = water;
        if (warning) hut.warning = warning;
        if (addedby) hut.addedby = addedby

        //check if name is unique
        const hutAlreadyExists = await Hut.findOne({name});
        if (hutAlreadyExists) {
            return res.status(400).json({error: `Hut with this name already exists`});
        }

        //save
        const createdHut = await hut.save();
        if (!createdHut) {
            return res.status(500).json({error: `Hut could not be saved`});
        }

        res.status(201).json(createdHut);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (addHut)`});
    }
};



//GET ALL HUTS
exports.getHuts = async (req, res) => {
    try {
        const huts = await Hut.find({}).populate('addedby', 'email');
        if (!huts) {
            return res.status(404).json({error: `Huts not found`});
        }

        res.json(huts);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({erorr: `Server error (getHuts)`});
    }
}



//GET HUT BY ID
exports.getHut = async (req, res) => {
    try {
        const hutId = req.params.hutId;
        if (!hutId) {
            return res.staus(400).json({error: `No hutId provided`});
        }

        const hut = await Hut.findById(hutId).populate('location', 'name').populate('type', 'name').populate('addedby', 'email');
        if (!hut) {
            return res.status(404).json({error: `Hut could not be found`});
        }

        res.json(hut);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getHut)`})
    }
}



//UPDATE HUT
exports.updateHut = async (req, res) => {
    try {
        //check params
        const hutId = req.params.hutId;
        if (!hutId) {
            return res.status(400).json({error: `No hutId provided`});
        }

        //get values from body
        const { name, latitude, longitude, location, type, image, where, objectdescription, water, warning, addedby } = req.body;
        if (!name || !latitude || !longitude || !location || !type || !image) {
            return res.status(400).json({error: `Incomplete data`});
        }

        //check if GPS is within Location
        const checkLocation = await Location.findById(location);
        if (!checkLocation) {
            return res.status(404).json({error: `Location not found`});
        }

        if (
            parseFloat(latitude) > parseFloat(checkLocation.maxLat) || 
            parseFloat(latitude) < parseFloat(checkLocation.minLat) || 
            parseFloat(longitude) > parseFloat(checkLocation.maxLong) || 
            parseFloat(longitude) < parseFloat(checkLocation.minLong)) {
                return res.status(400).json({error: `Provided coordinates are outside Hut's Location range`});
        }

        //check if type exists
        const checkType = await Type.findById(type);
        if (!checkType) {
            return res.status(404).json({error: `Type not found`});
        }

        //obj with updated data
        let newHut = {
            name,
            latitude,
            longitude,
            location,
            type,
            image,
            where,
            objectdescription,
            water,
            warning,
            addedby
        };

        //check if hut exists
        let hut = await Hut.findById(hutId);
        if (!hut) {
            return res.status(404).json({error: `Hut not found`});
        }

        //update hut
        hut = await Hut.findByIdAndUpdate(hutId, {$set: newHut}, {new: true});
        res.json(hut);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (updateHut)`});
    }
}



//UPDATE HUT IMAGE
exports.updateHutImage = async (req, res) => {
    try {
        //check params
        const hutId = req.params.hutId;
        if (!hutId) {
            return res.status(400).json({error: `No hutId provided`});
        }
        
        //check body for image
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({error: `Incomplete data`});
        }

        //check if hut exists
        let hut = await Hut.findById(hutId);
        if (!hut) {
            return res.status(404).json({error: `Hut not found`});
        }

        //update hut
        hut = await Hut.findByIdAndUpdate(hutId, {image}, {new: true});
        res.json(hut);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (updateHut)`}); 
    }
}



//DELETE HUT
exports.deleteHut = async (req, res) => {
    try {
        const hutId = req.params.hutId;
        if (!hutId) {
            return res.status(400).json({error: `No hutId provided`});
        }

        const hut = await Hut.findById(hutId);
        if (!hut) {
            res.status(404).json({error: `Hut could not be found`});
        }

        //also check if hut is in topPicks and remove it from there
        const isInTopPicks = await TopPick.findOne({hutId: hutId});
        if (isInTopPicks) {
            await TopPick.findOneAndRemove({hutId: hutId});
        }


        hut.remove((err, data) => {
            if (err) {
                return res.status(500).json({error: `Hut could not be deleted`});
            }

            res.json({message: `Hut deleted`});
        });       
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (deleteHut)`})
    }
}



//SEARCH HUTS + PAGINATION
exports.searchHuts = async (req, res) => {
    try {
        //pagination
        const perPage = 10;
        const page = Number(req.body.page) || 1;

        //searchword
        const searchword = req.body.searchword ?
            {name: {$regex: req.body.searchword, $options: 'i'}}
            :
            {}

        const location = req.body.location ?
            {location: req.body.location}
            :
            {}

        const type = req.body.type ?
            {type: req.body.type}
            :
            {}

        const sortby = req.body.sortby && req.body.sortby === 'recent' ?
            [['updatedAt', 'desc']]
            :
            req.body.sortby && req.body.sortby === 'alphabetically' ?
                [['name', 'asc']]
                :
                [['updatedAt', 'asc']] //if no sortby return ordered from oldest to latest

        //start search
        const hutsTotal = await Hut.countDocuments({...searchword, ...location, ...type });
        const huts = await Hut.find({...searchword, ...location, ...type })
            .populate('addedby', 'email')
            .populate('location', 'name')
            .populate('type', 'name')
            .sort(sortby)
            .limit(perPage)
            .skip((page - 1) * perPage)


        //error response
        if (!huts) {
            return res.status(404).json({error: `No huts matching your criteria found`});
        }

        //results response
        // console.table({huts, page, numberOfPages: Math.ceil(hutsTotal/perPage)}) //
        res.json({huts, page, numberOfPages: Math.ceil(hutsTotal/perPage)});
     
    } catch (err) {
        console.log(err);
        res.json({error: `Server error (searchHuts)`})
    }
}



exports.getHutsByLocation = async (req, res) => {
    try {
        const locationId = req.params.locationId;
        if (!locationId) {
            return res.status(400).json({error: `No locationId in params`});
        }

        const huts = await Hut.find({location: locationId}).populate('type', 'name').populate('location', 'name');
        if (!huts) {
            return res.status(404).json({error: `No huts found`});
        }

        res.json(huts);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getHutsByLocation)`});
    }
}
