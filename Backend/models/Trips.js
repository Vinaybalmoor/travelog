const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Trip", tripSchema);
