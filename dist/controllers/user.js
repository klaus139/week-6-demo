"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.createUser = exports.authorDelete = exports.deleteAuthor = exports.edit = exports.updateAuthor = exports.getAuthor = exports.getAuthors = exports.create_Auth = exports.createAuthor = void 0;
const user_1 = require("../models/user");
const utils_1 = require("../utils/utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Add author
function createAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            id: Number(req.body.id),
            author: req.body.author,
            dateRegistered: new Date(),
            age: req.body.age,
            address: req.body.address,
            books: [],
        };
        const result = yield (0, user_1.addAuthor)(user);
        const message = 'Author successfully created';
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res.status(404).render('error', { err: result.error, message: null });
        }
        else {
            return res.status(200).redirect('/users/authors');
            // .render('users', { authors: result?.value, message: message })
        }
    });
}
exports.createAuthor = createAuthor;
// post author via get
function create_Auth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('add-author');
    });
}
exports.create_Auth = create_Auth;
//get authors
function getAuthors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, user_1.readAllAuthors)();
        const message = 'Authors successfully gotten';
        if (result.error) {
            res
                .status(404)
                .render('error', { result: result.error, message: 'Authors not found' });
        }
        else {
            // const user = req.cookies.user;
            console.log(result.value);
            // res.status(200).render('users', { authors: result.value, message: message })
            res.status(200).render('users', { authors: result.value, message: message });
        }
    });
}
exports.getAuthors = getAuthors;
//get author
function getAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, user_1.readAuthor)(Number(req.params.id));
        const message = 'Author successfully gotten';
        if (result.error) {
            // console.log('omo');
            return res
                .status(404)
                .render('error', { result: result.error, message: 'Author not found' });
        }
        // console.log('great')
        // console.log(result.value);
        return res
            .status(200)
            .render('user', { author: result.value, message: message });
    });
}
exports.getAuthor = getAuthor;
//update author;
function updateAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //---
        if (!req.body) {
            res.status(400);
            throw new Error('No data given');
        }
        const authorDetail = req.body;
        const result = yield (0, user_1.editAuthor)(authorDetail);
        // const message = 'Author successfully updated'
        res.status(200).redirect('/users/authors');
    });
}
exports.updateAuthor = updateAuthor;
//edit author, get for the put request!
function edit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        res.render('update', { id });
    });
}
exports.edit = edit;
//delete Author
function deleteAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, user_1.removeAuthor)(Number(req.params.id));
        let message = 'Author successfully deleted';
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res.status(404).render('error', {
                result: result.error,
                message: 'Unable to delete author',
            });
        }
        else {
            return res.status(200).redirect('/users/authors');
            // .render('user', { result: result?.value, message: message })
        }
    });
}
exports.deleteAuthor = deleteAuthor;
//delete author via get
function authorDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        res.render('delete', { id });
    });
}
exports.authorDelete = authorDelete;
//create user.
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            emailaddress: req.body.emailaddress,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };
        //check for error;
        const { error } = yield (0, utils_1.validateRegistrationInput)(user);
        if (error) {
            const err = error.details[0].message;
            // console.error(err);
            return res.status(400).render('error', { error: err });
        }
        const result = yield (0, user_1.regDetails)(user);
        const id = result === null || result === void 0 ? void 0 : result.value.id;
        //cookie/token
        const token = yield generateToken(`${id}`); // generate token
        if (token !== undefined) {
            //save token inside cookie
            res.cookie('token', token);
            return res.redirect('/users/authors');
        }
        if (result === null || result === void 0 ? void 0 : result.error) {
            throw new Error('Something went wrong');
        }
    });
}
exports.createUser = createUser;
//loginUser;
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = {
                emailaddress: req.body.emailaddress,
                password: req.body.password,
            };
            const { error } = yield (0, utils_1.validateLoginInput)(user);
            if (!error) {
                const dataObj = yield (0, user_1.loginDetails)(user);
                if (dataObj && (yield bcrypt_1.default.compare(user.password, dataObj.password))) {
                    //cookie/token
                    const token = yield generateToken(`${dataObj.id}`); // generate token
                    //save token inside cookie
                    res.cookie('token', token);
                    return res.status(200).redirect('/users/authors');
                }
                else {
                    res.status(400);
                    throw new Error('Invalid emailaddress or password');
                }
            }
        }
        catch (err) {
            res.render('error', { error: err });
        }
    });
}
exports.logIn = logIn;
//--
const generateToken = function (id) {
    if (process.env.JWT_SECRET) {
        console.log('I am here oooo');
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
    }
};
