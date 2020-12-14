import mongoose from 'mongoose';

const CartOrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  items: [{
    bookId: {
      type: String,
      required: true
    }
  }],
  cost: {                // not valid if status is 'cart'
    type: Number,
    required: true
  }
}, {collection: "cartOrderCollection"});

const CartOrder = mongoose.model("cartOrderCollection", CartOrderSchema);
module.exports = CartOrder;