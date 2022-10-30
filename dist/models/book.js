"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.removeBook = exports.addBook = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = __importDefault(require("../utils/utils"));
//add book to author;
function addBook(id, book) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                throw new Error('Something went wrong with Db');
            }
            else {
                //read from database;
                const readDb = yield (0, utils_1.default)(pathName);
                const authors = JSON.parse(readDb);
                //find authorIndex
                const authorIndex = authors.findIndex((item) => {
                    return item.id === Number(id);
                });
                //if author exists;
                if (authorIndex !== -1) {
                    //set book id
                    const author = authors[authorIndex];
                    book.id =
                        author.books.length > 0 ? author.books[author.books.length - 1].id + 1 : 1;
                    author.books.push(book);
                    //write back to database;
                    fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong');
                        }
                        else {
                            const authorBookObj = { value: authors, error: null };
                            return authorBookObj;
                        }
                    });
                }
                else {
                    throw new Error('Author not found');
                }
            }
        }
        catch (err) {
            console.error(err);
            const authorBookObj = { value: null, error: err };
            return authorBookObj;
        }
    });
}
exports.addBook = addBook;
//delete book from author;
function removeBook(id, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                throw new Error('Something went wrong');
            }
            else {
                const readDb = yield (0, utils_1.default)(pathName);
                const authors = JSON.parse(readDb);
                //find authorIndex;
                const authorIndex = authors.findIndex((item) => {
                    return item.id === Number(id);
                });
                //find bookIndex;
                const bookIndex = authors[authorIndex].books.findIndex((item) => {
                    return item.id === Number(bookId);
                });
                //check if author exist
                if (authorIndex === -1) {
                    throw new Error('Author not found');
                }
                else {
                    if (bookIndex !== -1) {
                        authors[authorIndex].books.splice(bookIndex, 1);
                    }
                    //write back to database;
                    fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong');
                        }
                        else {
                            const authorObj = { value: authors, error: null };
                            return authorObj;
                        }
                    });
                }
            }
        }
        catch (err) {
            console.error(err);
            const authorObj = { value: null, error: err };
            return authorObj;
        }
    });
}
exports.removeBook = removeBook;
