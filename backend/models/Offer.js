import mongoose from "mongoose";

const OfferModel = mongoose.Schema({
  Bidder: {
    type: String,
    required: true,
  },
  Id: {
    type: String,
    required: true,
  },
  BidderId: {
    type: String,
    required: true
  },
  ListingId: {
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

const Offer = mongoose.model("Offers", OfferModel);
export default Offer;
