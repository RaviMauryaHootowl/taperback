import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  cover: {
    type: String, 
    required: true
  }
}, {collection: "booksCollection"});

const Book = mongoose.model("booksCollection", BookSchema);
module.exports = Book;