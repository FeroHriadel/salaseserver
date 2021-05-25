const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema; 



const commentSchema = new mongoose.Schema(
    {
        hutid: {
            type: ObjectId,
            ref: 'Hut',
            required: true,
        },
        user: {
            type: ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            trim: true,
            required: true
        },
        image: {
            type: Object
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Comment', commentSchema);