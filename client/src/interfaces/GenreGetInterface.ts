import {Book} from './BookInterface';
export interface GenreGetInterface {
  _id : any,
  genreName: String,
  genrePath: String,
  genreBooks: Array<Book>
}
