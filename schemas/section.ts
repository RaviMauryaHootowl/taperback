import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true
  },
  sectionCover: {
    type: String,
    required: true
  },
  sectionBooks : [
    {
      bookId: {
        type: String,
        required: true
      }
    }
  ],
}, {collection: "indexCollection"});

const Section = mongoose.model("SectionSchema", SectionSchema);
module.exports = Section;