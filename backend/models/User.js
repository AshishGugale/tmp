import mongoose from "mongoose";

const UserModel = mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  ID: {
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
  }
});

const User = mongoose.model("Users", UserModel);
export default User;
