import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema({
  genreName: {
    type: String,
    required: true
  },
  genrePath: {
    type: String,
    required: true
  },
  genreBooks: {
    type: [{
      bookId: {
        type: String,
        required: true
      }
    }],
    required: true
  }
}, {collection: "genreCollection"});

const Genre = mongoose.model("genreCollection", GenreSchema);
module.exports = Genre;