import express, { Response, Request } from 'express'
import {
  addAuthor,
  Author,
  Book,
  editAuthor,
  loginDetails,
  readAllAuthors,
  readAuthor,
  regDetails,
  removeAuthor,
} from '../models/user'
import readDataFile, {
  hashPassword,
  Login,
  Register,
  validateLoginInput,
  validateRegistrationInput,
} from '../utils/utils'
import bcrypt from 'bcrypt'
import path from 'path'
import jwt from 'jsonwebtoken'

//Add author
export async function createAuthor(req: Request, res: Response) {
  let user: Author = {
    id: Number(req.body.id),
    author: req.body.author,
    dateRegistered: new Date(),
    age: req.body.age,
    address: req.body.address,
    books: [],
  }

  const result = await addAuthor(user)
  const message = 'Author successfully created'
  if (result?.error) {
    return res.status(404).render('error', { err: result.error, message: null })
  } else {
    return res.status(200).redirect('/users/authors')
    // .render('users', { authors: result?.value, message: message })
  }
}

// post author via get
export async function create_Auth(req: Request, res: Response) {
  res.render('add-author')
}

//get authors
export async function getAuthors(req: Request, res: Response) {
  const result = await readAllAuthors()
  const message = 'Authors successfully gotten'

  if (result.error) {
    res
      .status(404)
      .render('error', { result: result.error, message: 'Authors not found' })
  } else {
    // const user = req.cookies.user;
    console.log(result.value)
    // res.status(200).render('users', { authors: result.value, message: message })
    res.status(200).render('users', { authors: result.value, message: message })
  }
}

//get author
export async function getAuthor(req: Request, res: Response) {
  const result = await readAuthor(Number(req.params.id))
  const message = 'Author successfully gotten'

  if (result.error) {
    // console.log('omo');
    return res
      .status(404)
      .render('error', { result: result.error, message: 'Author not found' })
  }
  // console.log('great')
  // console.log(result.value);
  return res
    .status(200)
    .render('user', { author: result.value, message: message })
}

//update author;
export async function updateAuthor(req: Request, res: Response) {
  //---
  if (!req.body) {
    res.status(400)
    throw new Error('No data given')
  }
  const authorDetail: Author = req.body
  const result = await editAuthor(authorDetail)
  // const message = 'Author successfully updated'
  res.status(200).redirect('/users/authors')
}

//edit author, get for the put request!
export async function edit(req: Request, res: Response) {
  const id: number = Number(req.params.id)
  res.render('update', { id })
}

//delete Author
export async function deleteAuthor(req: Request, res: Response) {
  const result = await removeAuthor(Number(req.params.id))
  let message = 'Author successfully deleted'

  if (result?.error) {
    return res.status(404).render('error', {
      result: result.error,
      message: 'Unable to delete author',
    })
  } else {
    return res.status(200).redirect('/users/authors')
    // .render('user', { result: result?.value, message: message })
  }
}

//delete author via get
export async function authorDelete(req: Request, res: Response) {
  const id = Number(req.params.id)
  res.render('delete', { id })
}

//create user.
export async function createUser(req: Request, res: Response) {
  let user: Register = {
    id: req.body.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailaddress: req.body.emailaddress,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }
  //check for error;
  const { error } = await validateRegistrationInput(user)
  if (error) {
    const err = error.details[0].message
    // console.error(err);
    return res.status(400).render('error', { error: err })
  }

  const result = await regDetails(user)
  const id = result?.value.id
  //cookie/token
  const token = await generateToken(`${id}`) // generate token
  if (token !== undefined) {
    //save token inside cookie
    res.cookie('token', token)
    return res.redirect('/users/authors')
  }
  if (result?.error) {
    throw new Error('Something went wrong')
  }
}

//loginUser;
export async function logIn(req: Request, res: Response) {
  try {
    const user: Login = {
      emailaddress: req.body.emailaddress,
      password: req.body.password,
    }
    const { error } = await validateLoginInput(user)
    if (!error) {
      const dataObj = await loginDetails(user)
      if (dataObj && (await bcrypt.compare(user.password, dataObj.password))) {
        //cookie/token
        const token = await generateToken(`${dataObj.id}`) // generate token
        //save token inside cookie
        res.cookie('token', token)
        return res.status(200).redirect('/users/authors')
      } else {
        res.status(400)
        throw new Error('Invalid emailaddress or password')
      }
    }
  } catch (err) {
    res.render('error', { error: err })
  }
}

//--
const generateToken = function (id: string) {
  if (process.env.JWT_SECRET) {
    console.log('I am here oooo')
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }
}
