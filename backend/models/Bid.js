import mongoose from "mongoose";

const BidModel = mongoose.Schema({
  BidderAddress: {
    type: String,
    required: true,
  },
  BidID: {
    type: String,
    required: true,
  },
  BidderID: {
    type: String,
    required: true
  },
  ItemID: {
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
