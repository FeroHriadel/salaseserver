const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;



const topPickSchema = new mongoose.Schema({
    hutId: {
        type: ObjectId,
        ref: "Hut",
        required: true
    },
    name: {
        type: ObjectId,
        ref: 'Hut'
    }
}, { timestamps: true });



module.exports = mongoose.model("TopPick", topPickSchema);