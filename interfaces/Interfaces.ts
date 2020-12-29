import mongoose from 'mongoose';

// Intefaces

interface SectionBook {
  bookId : String
}

interface SectionDataGet {
  _id: mongoose.ObjectId,
  sectionName: String,
  sectionCover: String,
  sectionBooks: Array<SectionBook>
}

interface SectionDataSend {
  sectionName: String,
  sectionCover: String,
  sectionBooks: Array<Book>
}

interface Book {
  _id: mongoose.ObjectId,
  title: String,
  author: String,
  desc: String,
  cover: String,
  cost: Number,
  ratings: String,
  subtitle: String
}

interface SectionsArrayDataGet extends Array<SectionDataGet>{}

export {SectionsArrayDataGet, Book, SectionDataSend, SectionDataGet, SectionBook}