import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import {LoginTicket, OAuth2Client} from 'google-auth-library';
const bookModel = require('./schemas/book');
const genreModel = require('./schemas/genre');
const sectionModel = require('./schemas/section');
const userModel = require('./schemas/user');
const cartOrderModel = require('./schemas/cartOrder');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json())
require('dotenv').config();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'build')));
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, 'client/build')));
}

const CLIENT_ID = `${process.env.REACT_APP_CLIENT_ID}`
const client = new OAuth2Client(CLIENT_ID);

// Connect DB
const dbLink = `${process.env.MONGO_SECRET}`;
mongoose.connect(dbLink, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}, () => {
  console.log("DB connected!");
});

const verify = async (token: string) : Promise<boolean> => {
  const ticket:LoginTicket|undefined = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  }).catch((err) => {
    return undefined;
  });
  if(ticket){
    const payload:any = ticket.getPayload();
    const userid = payload['sub'];
    console.log("----- PAYLOAD -----");
    console.log(payload);
    return true;
  }else{
    return false;
  }
}



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
  console.log("Index Books called!")
  const nOfSections = data.length;
  for(let i = 0; i < nOfSections; i++){
    const section = emptySectionModel();
    section.sectionName = data[i].sectionName;
    section.sectionCover = data[i].sectionCover;

    section.sectionBooks = await getBooksArray(data[i].sectionBooks);
    sections.push(section);
  }
  // console.log(sections);
  res.send(sections);
})

app.get("/api/search", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const searchQuery = req.query;
  // console.log(searchQuery);
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
  // console.log(genreQuery);
  let genreMatched = await genreModel.findOne(
    {genrePath: genreQuery.genrePath}
  );
  
  let genreResult: any = {
    genreName: genreMatched.genreName,
    genrePath: genreMatched.genrePath
  }
  genreResult.genreBooks = await getBooksArray(genreMatched.genreBooks);

  // console.log(genreResult);
  res.send(genreResult);
});

app.post("/api/userLogin", async (req: express.Request, res: express.Response) => {
  const {user} = req.body;
  const userData = {
    googleId: user.googleId,
    email: user.email,
    name: user.name,
    cart: "",
    orders: []
  }
  // console.log(userData);
  let result = await userModel.findOne({googleId: userData.googleId});
  if(result == null){
    result = new userModel(userData);
    result.save();
  }
  let cart: any = await getCartDetails(userData.googleId);
  const userObjectToSend = result.toObject({ getters: true, virtuals: false });
  userObjectToSend.cartItems = cart;
  console.log(userObjectToSend);
  res.send(userObjectToSend)
})

const getCartDetails = async (userGoogleId: string) => {
  const user = await userModel.findOne({googleId: userGoogleId});
    // if users cart is empty string
    // create new cartOrder Document
    let cart;
    if(user.cart == ""){
      const emptyCartObject = {
        user_id: userGoogleId,
        status: "cart",
        items: [],
        cost: 0
      }
      cart = new cartOrderModel(emptyCartObject);
      user.cart = cart._id;
      await user.save();
    }else{
      cart = await cartOrderModel.findOne({_id : user.cart});
      // console.log(cart);
    }
    return cart;
}

app.get("/api/getCart", async (req: express.Request, res: express.Response) => {
  const {cartId} = req.query; 
  
  const cart = await cartOrderModel.findOne({_id : cartId});
  const cartItems = cart.toObject().items;
  let bookCartItems = [];
  for(let i = 0; i < cartItems.length; i++){
    const book = await fetchBookData(cartItems[i].bookId);
    bookCartItems.push(book)
  }

  res.send(bookCartItems);
})

app.post("/api/addToCart", async (req: express.Request, res: express.Response) => {
  const {tokenId, bookId, userGoogleId} = req.body;
  const isVerified:boolean = await verify(tokenId);
  
  if(isVerified) {
    let cart:any = await getCartDetails(userGoogleId);
    cart.items.push({bookId: bookId});
    await cart.save();

    //console.log(cart);
    res.send({message: "Added to cart", cart : cart.toObject()})
  } else {
    res.send({message: "Invalid Token"})
  }
})

const getBooksArray = async (books : Array<SectionBook>) => {
  let booksData : Array<Book> = [];
  const nOfBooks = books.length;
  for(let i = 0; i < nOfBooks; i++){
    const bookData = await fetchBookData(books[i].bookId);
    
    booksData.push(bookData);
    // console.log(bookData.title);
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

if(process.env.NODE_ENV === 'production'){
  app.get('*', (req : express.Request, res : express.Response) => {    
    res.sendFile(path.join(__dirname = 'client/build/index.html'));  
  })
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
