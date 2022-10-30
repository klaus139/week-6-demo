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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookDelete = exports.deleteBook = exports.bookCreate = exports.createBook = void 0;
const book_1 = require("../models/book");
//add book
function createBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = {
            id: Number(req.body.id),
            name: req.body.name,
            isPublished: true,
            datePublished: new Date(),
            serialNumber: req.body.isdn,
        };
        const result = yield (0, book_1.addBook)(Number(req.body.id), book);
        const message = 'Book successfully added to author';
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res
                .status(404)
                .render('error', { result: result.error, message: null });
        }
        else {
            return res
                .status(200)
                .redirect('/users/authors');
            // .render('book', { authors: result?.value, message: message })
        }
    });
}
exports.createBook = createBook;
//bookCreate
function bookCreate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const id : number = Number(req.params.id);
        res.render('book');
    });
}
exports.bookCreate = bookCreate;
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, book_1.removeBook)(Number(req.params.id), Number(req.body.bookId));
        const message = 'Book successfully deleted';
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res.status(404).render('error', { result: result.error, message: null });
        }
        else {
            return res.status(200)
                .redirect('/users/authors');
            // .render('book',{authors: result?.value, message: message});
        }
    });
}
exports.deleteBook = deleteBook;
function bookDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        res.render('deleteBook', { id });
    });
}
exports.bookDelete = bookDelete;
