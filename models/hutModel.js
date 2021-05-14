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
    gps: {
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        }
    },
    location: {
      type: ObjectId,
      ref: "Location",
    },
    type: {
      type: ObjectId,
      ref: "Type",
    },
    titleimage: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hut", hutSchema);
