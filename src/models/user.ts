import * as fs from 'fs'
import path from 'path'
import { updateAuthor } from '../controllers/user'
import readDataFile, {
  validateRegistrationInput,
  hashPassword,
  Login,
} from '../utils/utils'
import { Register } from '../utils/utils'
const _ = require('lodash')

export interface Author {
  id: number
  author: string
  dateRegistered: Date
  age: number
  address: string
  books: Book[]
}
export interface Book {
  id: number
  name: string
  isPublished: boolean
  datePublished: Date
  serialNumber: number
}

//POST method..
export async function addAuthor(user: Author) {
  const pathName: string = path.join(__dirname, 'database.json')
  try {
    const fileExist = fs.existsSync(pathName)
    //check if does not fileexist
    if (!fileExist) {
      user.id = 1 // set user id to 1;
      //write back to the database;
      fs.writeFile(pathName, JSON.stringify([user], null, 2), (err) => {
        if (err) {
          throw new Error('Something went wrong with database')
        } else {
          const dataObj = { value: user, error: null }
          return dataObj
        }
      })
    }
    if (fileExist) {
      const readDb = await readDataFile(pathName)
      const readDataDb: Author[] = JSON.parse(readDb)
      //check if the array is empty
      if (readDataDb.length === 0) {
        user.id = 1
        readDataDb.push(user)
        fs.writeFile(pathName, JSON.stringify(readDataDb, null, 2), (err) => {
          if (err) {
            throw new Error('Something went wrong with database')
          } else {
            const dataObj = { value: user, error: null }
            return dataObj
          }
        })
      } else {
        const readDb = await readDataFile(pathName)
        const readDataDb: Author[] = JSON.parse(readDb)

        user.id = readDataDb[readDataDb.length - 1].id + 1
        readDataDb.push(user)
        fs.writeFile(pathName, JSON.stringify(readDataDb, null, 2), (err) => {
          if (err) {
            throw new Error('Something went wrong with database')
          } else {
            const dataObj = { value: user, error: null }
            return dataObj
          }
        })
      }
    }
  } catch (err) {
    const pathName: string = path.join(__dirname, 'database.json')
    if (err) {
      fs.writeFileSync(pathName, JSON.stringify([user], null, 2))
    } else {
      const dataObj = { value: null, error: err }
      return dataObj
    }
  }
}

// Get all authors!
export async function readAllAuthors() {
  //define the filepath;
  const pathName: string = path.join(__dirname, 'database.json')
  try {
    const fileExist = fs.existsSync(pathName)
    // check if file does not exist!
    if (!fileExist) {
      throw new Error('Something went wrong')
    } else {
      const readDb = await readDataFile(pathName)
      const dbParsedObj = JSON.parse(readDb)
      const dataBaseObj = { value: dbParsedObj, error: null }
      return dataBaseObj
    }
  } catch (err) {
    console.error(err)
    const errorObj = { value: null, error: err }
    return errorObj
  }
}

//get specific author;
export async function readAuthor(id: number) {
  //read filepath
  const pathName: string = path.join(__dirname, 'database.json')
  try {
    const fileExist = fs.existsSync(pathName)
    if (!fileExist) {
      throw new Error('Something went wrong')
    } else {
      const readDb = await readDataFile(pathName)
      const authors: Author[] = JSON.parse(readDb)

      const author = authors.find((item) => {
        return item.id === Number(id)
      })

      ///check if author exists
      if (!author) {
        const authorObj = { value: 'Author not available', error: true }
        return authorObj
      } else {
        const authorObj = { value: author, error: false }
        return authorObj
      }
    }
  } catch (err) {
    console.error(err)
    const authorObj = { value: null, error: 'Request not completed' }
    return authorObj
  }
}

//edit update ---
export async function editAuthor(user: Author) {
  //define path.
  const pathName: string = path.join(__dirname, 'database.json')

  try {
    const fileExist = fs.existsSync(pathName)
    if (!fileExist) {
      throw new Error('Something went wrong')
    } else {
      const readDb = await readDataFile(pathName) //read from database
      const { id, author, dateRegistered, age, address, books } = user //destructure reqbody
 //destructure reqbody
      const authors: Author[] = JSON.parse(readDb)

      //find the particular author to be edited.
      const authorIndex: number = authors.findIndex((item) => {
        return item.id === Number(id)
      })
      //if author does not exist
      if (authorIndex === -1) {
        throw new Error('Author not available')
      } else {
        //modified... insert req body data to that of the database.
        authors[authorIndex].address = address || authors[authorIndex].address
        authors[authorIndex].age = age || authors[authorIndex].age
        authors[authorIndex].author = author || authors[authorIndex].author

        //write back to the file;
        fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
          if (err) {
            throw new Error('Something went wrong')
          } else {
            const authorObj = { value: user, error: null }
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

//Delete Author
export async function removeAuthor(id: number) {
  const pathName: string = path.join(__dirname, 'database.json')
  try {
    const fileExist = fs.existsSync(pathName)
    if (!fileExist) {
      throw new Error('Something went wrong')
    } else {
      //read from database;
      const readDb = await readDataFile(pathName)
      const authors: Author[] = JSON.parse(readDb)

      // find index of author;
      const authorIndex = authors.findIndex((item) => {
        return item.id === Number(id)
      })
      //always check if the author exists
      if (authorIndex === -1) {
        throw new Error('Author does not exist')
      } else {
        authors.splice(authorIndex, 1)

        //write back to database;
        fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
          if (err) {
            throw new Error('Something went wrong')
          } else {
            const authorObj = { value: authors[authorIndex], error: null }
            return authorObj
          }
        })
      }
    }
  } catch (err) {
    console.error(err)
    const authorObj = { value: false, error: err }
    return authorObj
  }
}

//user resistration details
export async function regDetails(user: Register) {
  const pathName: string = path.join(__dirname, 'userdata.json')
  try {

    const fileExist = fs.existsSync(pathName)
    if (!fileExist) {
      user.id = 1
      const newUser = _.pick(user, [
        'id',
        'firstname',
        'lastname',
        'emailaddress',
        'password',
      ])
      newUser.password = await hashPassword(newUser.password)

      fs.writeFileSync(pathName, JSON.stringify([newUser], null, 2))
      //return data to user
      const uUser = _.pick(user, ['id', 'firstname', 'emailaddress'])
      const dataObj = { value: uUser, error: null }
      return dataObj
    }
    //if it exists;
    if (fileExist) {
      const readDb = await readDataFile(pathName)
      const dataBaseObj: Register[] = JSON.parse(readDb)

      ///check if user already exist
      const userExist: number = dataBaseObj.findIndex((item) => {
        return item.emailaddress === user.emailaddress
      })
      if (userExist !== -1) {
        throw new Error('User already exist')
      }
      //else check for if the array is empty!
      if (dataBaseObj.length === 0) {
        user.id = 1
        //write to database
        const newUser = _.pick(user, [
          'id',
          'firstname',
          'lastname',
          'emailaddress',
          'password',
        ])
        newUser.password = await hashPassword(newUser.password) //---
        dataBaseObj.push(newUser)
        fs.writeFileSync(pathName, JSON.stringify(dataBaseObj, null, 2))
        //return data to user
        const uUser = _.pick(user, ['id', 'firstname', 'emailaddress'])
        const dataObj = { value: uUser, error: null }
        return dataObj
      }
      //update user id and write back to database
      user.id = dataBaseObj[dataBaseObj.length - 1].id + 1
      const newUser = _.pick(user, [
        'id',
        'firstname',
        'lastname',
        'emailaddress',
        'password',
      ])
      newUser.password = await hashPassword(newUser.password) //---
      dataBaseObj.push(newUser)
      fs.writeFileSync(pathName, JSON.stringify(dataBaseObj, null, 2))
      //return data to user;
      const uUser = _.pick(user, ['id', 'firstname', 'emailaddress'])
      // console.log(uUser);
      const dataObj = { value: uUser, error: null }
      return dataObj
    }
  } catch (err) {
    const pathName: string = path.join(__dirname, 'userdata.json')
    const fileExist = fs.existsSync(pathName)
    if (!fileExist) {
      if (err) {
        //update user
        user.id = 1
        const newUser = _.pick(user, [
          'id',
          'firstname',
          'lastname',
          'emailaddress',
          'password',
        ])
        newUser.password = await hashPassword(newUser.password) //----
        //write back to database
        fs.writeFileSync(pathName, JSON.stringify([newUser], null, 2))
        const uUser = _.pick(user, ['id', 'firstname', 'emailaddress']) //lodash;
        //return data to user
        const dataObj = { value: uUser, error: null }
        return dataObj
      } else {
        const dataObj = { value: null, error: err }
        return dataObj
      }
    }
    console.error(err)
    const dataObj = { value: null, error: err }
    return dataObj
  }
}

//verifylogin;
export async function loginDetails(user: Login) {
  const pathName: string = path.join(__dirname, 'userdata.json')
  try {
    const readDb = await readDataFile(pathName)
    const dataBaseObj: Register[] = JSON.parse(readDb)
    const userData = dataBaseObj.find((item) => {
      return item.emailaddress === user.emailaddress
    })
    return userData
  } catch (err) {
    console.error(err)
  }
}
