import express from 'express';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { Book, SectionBook, SectionDataSend, SectionsArrayDataGet } from 'interfaces/Interfaces';
const apirouter = express.Router();
const bookModel = require('../schemas/book');
const sectionModel = require('../schemas/section');
const genreModel = require('../schemas/genre');
const userModel = require('../schemas/user');
const cartOrderModel = require('../schemas/cartOrder');
require('dotenv').config();
const CLIENT_ID = `${process.env.REACT_APP_CLIENT_ID}`
const client = new OAuth2Client(CLIENT_ID);


apirouter.get("/allbooks", async (req : express.Request, res : express.Response) => {
  const books = await bookModel.find({});
  res.send(books);
})

apirouter.get("/findBook", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const bookIdQuery = req.query;
  let book : Book;
  book = await bookModel.findById(bookIdQuery.bookId);
  res.send(book);
});

apirouter.get("/indexBooks", async (req : express.Request, res : express.Response) => {
  const data : SectionsArrayDataGet = await sectionModel.find({});
  const sections:any = [];
  // console.log("Index Books called!")
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

apirouter.get("/search", async (req: express.Request, res: express.Response) => {
  if(!req.query){ res.status(400); }
  const searchQuery = req.query;
  // console.log(searchQuery);
  let searchBooks : Array<Book> = [];
  searchBooks = await bookModel.aggregate([
    {
      '$search': {
        'text': {
          'query': `${searchQuery.query}`, 
          'path': [
            'title', 'desc', 'subtitle', 'author'
          ]
        }
      }
    }
  ])
  res.send(searchBooks);
});


const emptySectionModel  = () : SectionDataSend => {
  return {
    sectionName: "",
    sectionCover: "",
    sectionBooks: []
  }
}

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

const fetchBookData = async (id: String) => {
  const bookData : Book = await bookModel.findById(id);
  return bookData;
}

apirouter.get("/genre", async (req: express.Request, res: express.Response) => {
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

apirouter.post("/userLogin", async (req: express.Request, res: express.Response) => {
  const {user} = req.body;
  if(user){
    const userData = {
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      cart: "0",
      orders: []
    }
    // console.log(userData);
    let result = await userModel.findOne({googleId: userData.googleId});
    if(result == null){
      result = new userModel(userData);
      await result.save();
    }
    let cart: any = await getCartDetails(userData.googleId);
    const userObjectToSend = result.toObject({ getters: true, virtuals: false });
    userObjectToSend.cartItems = cart;
    userObjectToSend.cart = cart._id;
    // console.log(userObjectToSend);
    res.send(userObjectToSend)
  }else{
    res.send({message: "error"}).status(404)
  }
  
});

apirouter.post("/userLoginFast", async (req: express.Request, res: express.Response) => {
  const {userGoogleId} = req.body;
  let result = await userModel.findOne({googleId: userGoogleId});
  if(result == null){
    res.send({message: "error"}).status(500);
  }
  let cart: any = await getCartDetails(result.googleId);
  const userObjectToSend = result.toObject({ getters: true, virtuals: false });
  userObjectToSend.cartItems = cart;
  userObjectToSend.cart = cart._id;
  res.send(userObjectToSend)
});


apirouter.get("/refreshUser", async (req: express.Request, res: express.Response) => {
  const {userGoogleId} = req.query;

  const user = await userModel.findOne({googleId: userGoogleId});
  if(user != null){
    const cart = await getCartDetails(user.googleId);
    const userObject = user.toObject();
    userObject.cartItems = cart.toObject();
    res.send(userObject);
  }else{
    res.send({message: "error"});
  }

})


const getCartDetails = async (userGoogleId: string) => {
  const user = await userModel.findOne({googleId: userGoogleId});
    // if users cart is empty string
    // create new cartOrder Document
    let cart;
    if(user.cart == "0"){
      const emptyCartObject = {
        user_id: userGoogleId,
        status: 0, // cart
        items: [],
        cost: 0
      }
      // console.log("CREATING NEW CART.....");
      cart = new cartOrderModel(emptyCartObject);
      user.cart = cart._id;
      await user.save();
      await cart.save();
    }else{
      cart = await cartOrderModel.findOne({_id : user.cart});
    }
    return cart;
}

apirouter.get("/getCart", async (req: express.Request, res: express.Response) => {
  const {cartId} = req.query; 
  
  const cart = await cartOrderModel.findOne({_id : cartId});
  const cartItems = cart.toObject().items;
  let bookCartItems:any = [];
  for(let i = 0; i < cartItems.length; i++){
    const book = await fetchBookData(cartItems[i].bookId);
    bookCartItems.push(book)
  }

  res.send(bookCartItems);
})

apirouter.post("/addToCart", async (req: express.Request, res: express.Response) => {
  const {tokenId, bookId, userGoogleId} = req.body;
  const isVerified:boolean = await verify(tokenId);
  
  if(isVerified) {
    let cart:any = await getCartDetails(userGoogleId);
    cart.items.push({bookId: bookId});
    await cart.save();

    console.log(cart);
    res.send({message: "Added to cart", cart : cart.toObject()})
  } else {
    res.send({message: "Invalid Token"})
  }
})

apirouter.post("/createCartForBuy", async (req: express.Request, res: express.Response) => {
  const {tokenId, bookId, userGoogleId} = req.body;
  const emptyCartObject = {
    user_id: userGoogleId,
    status: 0, // cart
    items: [
      { bookId }
    ],
    cost: 0
  }
  // console.log("CREATING NEW CART.....");
  const cart = new cartOrderModel(emptyCartObject);
  await cart.save();
  const cartId = cart._id;
  const cartItems = cart.toObject().items;
  let bookCartItems:any = [];
  for(let i = 0; i < cartItems.length; i++){
    const book = await fetchBookData(cartItems[i].bookId);
    bookCartItems.push(book)
  }
  res.send({message: "cart created", cart : bookCartItems, cartId})
})

apirouter.post("/orderCart", async (req: express.Request, res: express.Response) => {
  const {tokenId, cartId, userGoogleId, address} = req.body;
  const isVerified:boolean = await verify(tokenId);
  console.log(isVerified);
  if(isVerified){
    // Mark Cart Status as ordered
    let cart:any = await cartOrderModel.findOne({_id : cartId});
    console.log(cart);
    if(cart){
      cart.status = 1;  // ordered
      // set cart.cost
      cart.cost = await getCartCost(cart.items);
      cart.save();
      // console.log("------------ cart status changed ------------------")
      // From users send this cartId to orders
      const user = await userModel.findOne({googleId: userGoogleId});
      if(user.cart == cartId) {user.cart = "0";}
      user.orders.push({id : cartId})
      user.save();
      res.send({"message" : "ordered"})
    }
  }else{
    res.send({"message" : "error"}).status(500)
  }
});

const getCartCost = async (cartItems) => {
  let totalCost = 0
  for(let i = 0; i < cartItems.length; i++){
    const bookData = await fetchBookData(cartItems[i].bookId);
    totalCost += Number(bookData.cost);
  }
  return totalCost;
}

apirouter.get("/getOrders", async (req: express.Request, res: express.Response) => {
  const {userGoogleId} = req.query; 
  const user = await userModel.findOne({googleId: userGoogleId});
  if(user !== null){
    const orderedListIds = (user.toObject()).orders;
    const orderedList:any = [];
    for(let i = 0; i < orderedListIds.length; i++){
      const cart = await cartOrderModel.findOne({_id : orderedListIds[i].id})
      orderedList.push(cart.toObject());
    }
    console.log(orderedList);
    res.send({orders: orderedList});
  }else{
    res.send({message: "error"})
  }
})



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
    return true;
  }else{
    return false;
  }
}


export {apirouter};