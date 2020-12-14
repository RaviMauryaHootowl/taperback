import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    type: String,
    required: true
  },
  orders: [{
    id: {
      type: String,
      required: true
    }
  }]
}, {collection: "userCollection"});

const User = mongoose.model("userCollection", UserSchema);
module.exports = User;