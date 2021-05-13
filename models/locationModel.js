const mongoose = require('mongoose');



const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        image: {
            type: Object,
            required: true
        },
        maxLong: {
            type: String,
            trim: true,
            required: true
        },
        minLong: {
            type: String,
            trim: true,
            required: true
        },
        maxLat: {
            type: String,
            trim: true,
            required: true
        },
        minLat: {
            type: String,
            trim: true,
            required: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Location', locationSchema);