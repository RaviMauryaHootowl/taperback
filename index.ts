import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { AppError } from 'utils/AppError';
import {apirouter} from './api/BooksApi' ;

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json())
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Connect DB
const dbLink = `${process.env.MONGO_SECRET}`;
mongoose.connect(dbLink, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}, () => {
  console.log("DB connected!");
});


app.use('/api', apirouter);


if(process.env.NODE_ENV === 'production'){
  app.get('*', (req : express.Request, res : express.Response) => {    
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}


app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
  console.log("Entered error handler");
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'error';
  res.status(err.statusCode).send({
    status: err.statusCode,
    message: err.message
  });
})

app.listen(PORT, () => {
  console.log("Server started at PORT ", PORT)
})