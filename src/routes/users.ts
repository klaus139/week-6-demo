import express, { Request, Response, NextFunction} from  'express';
import { createBook, deleteBook, bookCreate, bookDelete } from '../controllers/book';
import { createAuthor, deleteAuthor, getAuthor, getAuthors, updateAuthor, authorDelete, create_Auth, edit, createUser, logIn} from '../controllers/user';
import { isLoggedIn } from '../middleware/auth';
import { logout } from '../utils/utils';

// import { createBook } from '../controllers/book';


const  router = express.Router();

/* GET users listing. */
//login route
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', logIn);

//create user.
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.post('/register', createUser);

//logout
router.get('/logout', logout);

//Post request.
router.post('/authors',isLoggedIn, createAuthor);
router.get('/add_author',isLoggedIn, create_Auth)

//get all authors;
router.get('/authors',isLoggedIn, getAuthors );

//get author
router.get('/get_author/:id',isLoggedIn, getAuthor);

//edit author
router.put('/update_author',isLoggedIn, updateAuthor ); //post
router.get('/update/:id',isLoggedIn, edit) //get

//delete author
router.delete('/delete_authors/:id',isLoggedIn, deleteAuthor); // delete works as a post.
router.get('/delete_authors/:id',isLoggedIn, authorDelete ) // resembles a get for delete

//add book
router.post('/books',isLoggedIn, createBook)
router.get('/book_create',isLoggedIn, bookCreate)

//delete book
router.delete('/books/:id',isLoggedIn, deleteBook );
router.get('/delete_book/:id',isLoggedIn, bookDelete);

//user login

// router.post('/register', createUser);


export default router;
