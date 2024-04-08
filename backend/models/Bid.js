import mongoose from "mongoose";

const BidModel = mongoose.Schema({
  BidID: {
    type: String,
    required: true,
  },
  ItemID: {
    type: String,
    required: true,
  },
  UserID: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  IsActive: {
    type: Boolean,
    default: true
  }
});

const Bid = mongoose.model("Bids", BidModel);
export default Bid;
