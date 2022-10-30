"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = require("../controllers/book");
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const utils_1 = require("../utils/utils");
// import { createBook } from '../controllers/book';
const router = express_1.default.Router();
/* GET users listing. */
//login route
router.get('/login', function (req, res, next) {
    res.render('login');
});
router.post('/login', user_1.logIn);
//create user.
router.get('/register', function (req, res, next) {
    res.render('register');
});
router.post('/register', user_1.createUser);
//logout
router.get('/logout', utils_1.logout);
//Post request.
router.post('/authors', auth_1.isLoggedIn, user_1.createAuthor);
router.get('/add_author', auth_1.isLoggedIn, user_1.create_Auth);
//get all authors;
router.get('/authors', auth_1.isLoggedIn, user_1.getAuthors);
//get author
router.get('/get_author/:id', auth_1.isLoggedIn, user_1.getAuthor);
//edit author
router.put('/update_author', auth_1.isLoggedIn, user_1.updateAuthor); //post
router.get('/update/:id', auth_1.isLoggedIn, user_1.edit); //get
//delete author
router.delete('/delete_authors/:id', auth_1.isLoggedIn, user_1.deleteAuthor); // delete works as a post.
router.get('/delete_authors/:id', auth_1.isLoggedIn, user_1.authorDelete); // resembles a get for delete
//add book
router.post('/books', auth_1.isLoggedIn, book_1.createBook);
router.get('/book_create', auth_1.isLoggedIn, book_1.bookCreate);
//delete book
router.delete('/books/:id', auth_1.isLoggedIn, book_1.deleteBook);
router.get('/delete_book/:id', auth_1.isLoggedIn, book_1.bookDelete);
//user login
// router.post('/register', createUser);
exports.default = router;
