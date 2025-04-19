const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Base64 or URL of the image
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // Ensuring doctorId is always provided
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const ImageData = mongoose.model("ImageData", imageSchema);
module.exports = ImageData;
