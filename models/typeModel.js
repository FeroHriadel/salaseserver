const mongoose = require('mongoose');



const typeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Type', typeSchema);