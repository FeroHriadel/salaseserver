const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;



const hutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },

    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    location: {
      type: ObjectId,
      ref: "Location",
      required: true
    },
    type: {
      type: ObjectId,
      ref: "Type",
      required: true
    },
    image: {
        type: Object,
        required: true
    },
    where: {
        type: String,
        default: 'No directions have been provided'
    },
    objectdescription: {
      type: String,
      default: 'No description have been provided'
    },
    water: {
      type: String,
      default: 'No water source have been provided'
    },
    warning: {
      type: String,
      default: 'No warning have been provided'
    },
    addedby: {
      type: ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hut", hutSchema);
