import mongoose from "mongoose";

const ShoseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isAdded: {
      type: Boolean,
    },
    isFavorite: {
      type: Boolean,
    },
    favoriteId: {
      type: Number,
    },

    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Shose", ShoseSchema);
