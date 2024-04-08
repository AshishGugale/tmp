import mongoose from "mongoose";

const ItemModel = mongoose.Schema({
  SellerID: {
    type: String,
    required: true
  },

  ItemID: {
    type: String,
    required: true,
  },
  AcceptedBid: {
    type: Object,
  },
  price: {
    type: Number,
    required: true,
  },
  IsActive: {
    type: Boolean,
    default: false
  }
});

const Item = mongoose.model("Items", ItemModel);
export default Item;