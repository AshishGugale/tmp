import mongoose from "mongoose";

const BidModel = mongoose.Schema({
  ItemID: {
    type: String,
    required: true,
  },
  price:{
    
  }  
});

const User = mongoose.model("Users", UserModel);
export default User;
