import mongoose from "mongoose";

const UserModel = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  ID: {
    type: String,
    required: true,
  },
  contracts: {
    type: Array,
    default: [],
    required: true,
  },
});

const User = mongoose.model("Users", UserModel);
export default User;
