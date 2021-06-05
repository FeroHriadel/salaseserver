const Hut = require('../models/hutModel');
const Location = require('../models/locationModel');
const Type = require('../models/typeModel');
const TopPick = require('../models/topPickModel');



//CREATE
exports.addTopPick = async(req, res) => {
    try {
        const hutId = req.body.hutId;

        if (!hutId) {
            return res.status(400).json({error: `hutId is required (addTopPick)`});
        }

        const topPickAlreadyExists = await TopPick.findOne({hutId});
        if (topPickAlreadyExists) {
            return res.status(400).json({error: `This hut already is in topPicks`});
        }
    
        const hut = await Hut.findById(hutId);
        if (!hut) {
            return res.status(404).json({error: `Hut not found`})
        }
    
        const topPicksLength = await TopPick.countDocuments();
        if (topPicksLength >= 9) {
            return res.status(403).json({error: `Maximum topPicks lenght (9) exceeded. Delete a topPick first`});
        }
    
        const topPick = new TopPick({
            hutId,
            name: hutId,
        });
    
        const createdTopPick = await topPick.save();
        if (!createdTopPick) {
            return res.status(500).json({error: `topPick could not be saved`});
        }
    
        res.status(201).json(createdTopPick);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (addTopPick)`});
    }
}



//GET ALL
exports.getTopPicks = async (req, res) => {
    try {
        const topPicks = await TopPick.find({}).populate('name', 'name');
        if (!topPicks) {
            return res.status(404).json({err: `Top Picks could not be found`})
        }

        res.json(topPicks);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getTopPicks)`});
    }
}



//DELETE TOP-PICK
exports.deleteTopPick = (req, res) => {
    try {
        const topPickId = req.params.topPickId;
        if (!topPickId) {
            return res.status(400).json({error: `No hutId in request params`});
        }

        TopPick.findByIdAndRemove(topPickId).exec((err, success) => {
            if (err) {
                console.log(err);
                res.status(404).json({error: `Hut could not be removed from Top Picks`});
                return;
            }

            res.json({message: `Hut removed from Top Picks`});
        })
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (deleteTopPick)`})
    }
}