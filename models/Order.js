import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    comment: {
      type: String,
    },
    userInfo: {
      type: Object,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
