import * as fs from 'fs'
import { Stream } from 'stream'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import express, { Response, Request, NextFunction } from 'express'

export default function readDataFile(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let data: string = ''
    let readStream: Stream = fs.createReadStream(filepath, 'utf8')
    //reading in chunks
    readStream.on('data', (chunk: string) => {
      data += chunk
    })

    // on end
    readStream.on('end', () => {
      return resolve(data)
    })

    // on error
    readStream.on('error', (error) => {
      return reject(error)
    })
  })
}

export interface Register {
  id: number
  firstname: string
  lastname: string
  emailaddress: string
  password: string
  confirmPassword: string
}

export interface Login {
  emailaddress: string
  password: string
}

//---Validate registered user  details.
export async function validateRegistrationInput(user: Register) {
  //define a schema;
  const schema = Joi.object({
    id: Joi.number(),
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    emailaddress: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
      .required(),
    confirmPassword: Joi.ref('password'),
  })

  return schema.validate(user)
}

//--Validate login users;
export async function validateLoginInput(user: Login) {
  const schema = Joi.object({
    emailaddress: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
      .required(),
  })
  return schema.validate(user);
}

//hashing passwords
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

// hashPassword('1234').then(result => {
//     console.log(result);
// })

// Generate Token
// export const generateToken = function(id: string){
//     if(process.env.JWT_SECRET ){
//         return jwt.sign({id}, process.env.JWT_SECRET, {
//           expiresIn: '30d',
//       })
//     }
// }

export const logout =( async function(req: Request, res: Response, next: NextFunction){
    res.cookie('token', '')
    req.cookies.token = ''
    res.cookie('user', '')
    req.cookies.user = ''
    // res.cookie(req.cookies.token, '') 
    res.status(200).redirect('/users/login');
})