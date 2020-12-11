import express from 'express';
import mongoose from 'mongoose';
const bookModel = require('./schemas/book');
const genreModel = require('./schemas/genre');
const sectionModel = require('./schemas/section');
const app = express();
const PORT = 5000;
app.use(express.json())
require('dotenv').config();

// Connect DB
const dbLink = `${process.env.MONGO_SECRET}`;
mongoose.connect(dbLink, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}, () => {
  console.log("DB connected!");
});

app.get("/api/allbooks", async (req : express.Request, res : express.Response) => {
  const books = await bookModel.find({});
  res.send(books);
})

app.get("/api/findBook", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const bookIdQuery = req.query;
  let book : Book;
  book = await bookModel.findById(bookIdQuery.bookId);
  res.send(book);
});

app.get("/api/indexBooks", async (req : express.Request, res : express.Response) => {
  const data : SectionsArrayDataGet = await sectionModel.find({});
  const sections = [];

  const nOfSections = data.length;
  for(let i = 0; i < nOfSections; i++){
    const section = emptySectionModel();
    section.sectionName = data[i].sectionName;
    section.sectionCover = data[i].sectionCover;

    section.sectionBooks = await getBooksArray(data[i].sectionBooks);
    sections.push(section);
  }
  console.log(sections);
  res.send(sections);
})

app.get("/api/search", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const searchQuery = req.query;
  console.log(searchQuery);
  let searchBooks : Array<Book> = [];
  const regexBookSearch = new RegExp(`${searchQuery.query}`, 'i')
  searchBooks = await bookModel.find(
    {title: {$regex: regexBookSearch}}
  );
  res.send(searchBooks);
});

app.get("/api/genre", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const genreQuery = req.query;
  console.log(genreQuery);
  let genreMatched = await genreModel.findOne(
    {genrePath: genreQuery.genrePath}
  );
  
  let genreResult: any = {
    genreName: genreMatched.genreName,
    genrePath: genreMatched.genrePath
  }
  genreResult.genreBooks = await getBooksArray(genreMatched.genreBooks);

  console.log(genreResult);
  res.send(genreResult);
});

const getBooksArray = async (books : Array<SectionBook>) => {
  let booksData : Array<Book> = [];
  const nOfBooks = books.length;
  for(let i = 0; i < nOfBooks; i++){
    const bookData = await fetchBookData(books[i].bookId);
    
    booksData.push(bookData);
    console.log(bookData.title);
  }
  return booksData;
} 

const emptySectionModel  = () : SectionDataSend => {
  return {
    sectionName: "",
    sectionCover: "",
    sectionBooks: []
  }
}

const fetchBookData = async (id: String) => {
  const bookData : Book = await bookModel.findById(id);
  return bookData;
}

app.listen(PORT, () => {
  console.log("Server started at PORT ", PORT)
})



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
