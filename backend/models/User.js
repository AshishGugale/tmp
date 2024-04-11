import mongoose from "mongoose";

const UserModel = mongoose.Schema({
  Address: {
    type: String,
    required: true,
  },
  Items: {
    type: [Object],
    default: [],
  },
  Bids: {
    type: [Object],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model("Users", UserModel);
export default User;
