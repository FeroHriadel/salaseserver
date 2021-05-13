const Type = require('../models/typeModel');



//CREATE TYPE
exports.addType = (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({error: `Name is required`});
        }

        let newType = new Type({name});
        newType.save((err, type) => {
            if (err) {
                return res.status(500).json({error: `Type could not be saved`})
            }

            res.status(201).json(type);
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (addType)`})
    }
}



//GET ALL TYPES
exports.getTypes = async (req, res) => {
    try {
        const types = await Type.find({}).sort([['name', 'asc' ]]);
        if (!types) {
            return res.status(404).json({error: `No types found`});
        }

        res.json(types);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getTypes)`})
    }
}



//GET TYPE BY ID
exports.getType = (req, res) => {
    try {
        const typeId = req.params.typeId;
        if (!typeId) {
            return res.status(400).json({error: `No typeId provided`});
        }

        Type.findById(typeId).exec((err, type) => {
            if (err) {
                return res.status(404).json({error: `Type not found`});
            }

            res.json(type);
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getType)`});
    }
}



//UPDATE TYPE
exports.updateType = async (req, res) => {
    try {
        const typeId = req.params.typeId;
        if (!typeId) {
            return res.status(400).json({error: `No typeId found`});
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({error: `New name must be provided`});
        }

        let type = await Type.findById(typeId);
        if (!type) {
            return res.status(404).json({error: `Type not found`});
        }

        type.name = name;
        const updatedType = await Type.findByIdAndUpdate(typeId, {$set: type}, {new: true});
        res.json(updatedType);


    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (updateType)`})
    }
}



//DELETE TYPE
exports.deleteType = (req, res) => {
    try {
        const typeId = req.params.typeId;
        if (!typeId) {
            return res.status(400).json({error: `No typeId provided`});
        }

        Type.findByIdAndRemove(typeId).exec((err, success) => {
            if (err) {
                return res.status(500).json({error: `Type could not be deleted`});
            }

            res.json({message: `Type deleted`});
        })
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (deleteType)`});
    }
}