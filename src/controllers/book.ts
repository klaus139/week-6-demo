import express, { Response, Request } from 'express'
import { addBook, removeBook } from '../models/book'
import { Author, Book } from '../models/user'

//add book
export async function createBook(req: Request, res: Response) {
  const book: Book = {
    id: Number(req.body.id),
    name: req.body.name,
    isPublished: true,
    datePublished: new Date(),
    serialNumber: req.body.isdn,
  }
  const result = await addBook(Number(req.body.id), book)
  const message = 'Book successfully added to author'

  if (result?.error) {
    return res
      .status(404)
      .render('error', { result: result.error, message: null })
  } else {
    return res
      .status(200)
      .redirect('/users/authors')
      // .render('book', { authors: result?.value, message: message })
  }
}

//bookCreate
export async function bookCreate (req: Request, res: Response) {
  // const id : number = Number(req.params.id);
  res.render('book');
}



export async function deleteBook(req: Request, res: Response) {
    const result = await removeBook(Number(req.params.id), Number(req.body.bookId))
    const message = 'Book successfully deleted';

    if(result?.error){
        return res.status(404).render('error', {result: result.error, message: null})
    }
    else{
      return res.status(200)
      .redirect('/users/authors')
      // .render('book',{authors: result?.value, message: message});
    }
}

export async function bookDelete (req: Request, res: Response){
  const id : number = Number(req.params.id);
  res.render('deleteBook', {id});
}