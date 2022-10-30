import * as fs from 'fs'
import path from 'path'
import readDataFile from '../utils/utils'
import { Author, Book } from './user'

//add book to author;

export async function addBook(id: number, book: Book) {
    const pathName: string = path.join(__dirname, 'database.json')
    try {
      const fileExist = fs.existsSync(pathName)
      if (!fileExist) {
        throw new Error('Something went wrong with Db')
      } else {
        //read from database;
        const readDb = await readDataFile(pathName)
        const authors: Author[] = JSON.parse(readDb)
        //find authorIndex
        const authorIndex = authors.findIndex((item) => {
          return item.id === Number(id)
        })
        //if author exists;
        if (authorIndex !== -1) {
          //set book id
          const author: Author = authors[authorIndex]
  
          book.id =
            author.books.length > 0 ? author.books[author.books.length - 1].id + 1 : 1
            author.books.push(book)
  
          //write back to database;
          fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
            if (err) {
              throw new Error('Something went wrong')
            } else {
              const authorBookObj = { value: authors, error: null }
              return authorBookObj
            }
          })
        } else {
          throw new Error('Author not found')
        }
      }
    } catch (err) {
      console.error(err)
      const authorBookObj = { value: null, error: err }
      return authorBookObj
    }
  }
  
  //delete book from author;
  
  export async function removeBook(id: number, bookId: number) {
    const pathName: string = path.join(__dirname, 'database.json')
    try {
      const fileExist = fs.existsSync(pathName)
      if (!fileExist) {
        throw new Error('Something went wrong')
      } else {
        const readDb = await readDataFile(pathName)
        const authors: Author[] = JSON.parse(readDb)
  
        //find authorIndex;
        const authorIndex = authors.findIndex((item) => {
          return item.id === Number(id)
        })
        //find bookIndex;
        const bookIndex = authors[authorIndex].books.findIndex((item) => {
          return item.id === Number(bookId)
        })
        //check if author exist
        if (authorIndex === -1) {
          throw new Error('Author not found')
        } else {
          if (bookIndex !== -1) {
            authors[authorIndex].books.splice(bookIndex, 1)
          }
  
          //write back to database;
  
          fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
            if (err) {
              throw new Error('Something went wrong')
            } else {
              const authorObj = { value: authors, error: null }
              return authorObj
            }
          })
        }
      }
    } catch (err) {
      console.error(err)
      const authorObj = { value: null, error: err }
      return authorObj
    }
  }
  