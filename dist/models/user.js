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
exports.loginDetails = exports.regDetails = exports.removeAuthor = exports.editAuthor = exports.readAuthor = exports.readAllAuthors = exports.addAuthor = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = __importStar(require("../utils/utils"));
const _ = require('lodash');
//POST method..
function addAuthor(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            //check if does not fileexist
            if (!fileExist) {
                user.id = 1; // set user id to 1;
                //write back to the database;
                fs.writeFile(pathName, JSON.stringify([user], null, 2), (err) => {
                    if (err) {
                        throw new Error('Something went wrong with database');
                    }
                    else {
                        const dataObj = { value: user, error: null };
                        return dataObj;
                    }
                });
            }
            if (fileExist) {
                const readDb = yield (0, utils_1.default)(pathName);
                const readDataDb = JSON.parse(readDb);
                //check if the array is empty
                if (readDataDb.length === 0) {
                    user.id = 1;
                    readDataDb.push(user);
                    fs.writeFile(pathName, JSON.stringify(readDataDb, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong with database');
                        }
                        else {
                            const dataObj = { value: user, error: null };
                            return dataObj;
                        }
                    });
                }
                else {
                    const readDb = yield (0, utils_1.default)(pathName);
                    const readDataDb = JSON.parse(readDb);
                    user.id = readDataDb[readDataDb.length - 1].id + 1;
                    readDataDb.push(user);
                    fs.writeFile(pathName, JSON.stringify(readDataDb, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong with database');
                        }
                        else {
                            const dataObj = { value: user, error: null };
                            return dataObj;
                        }
                    });
                }
            }
        }
        catch (err) {
            const pathName = path_1.default.join(__dirname, 'database.json');
            if (err) {
                fs.writeFileSync(pathName, JSON.stringify([user], null, 2));
            }
            else {
                const dataObj = { value: null, error: err };
                return dataObj;
            }
        }
    });
}
exports.addAuthor = addAuthor;
// Get all authors!
function readAllAuthors() {
    return __awaiter(this, void 0, void 0, function* () {
        //define the filepath;
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            // check if file does not exist!
            if (!fileExist) {
                throw new Error('Something went wrong');
            }
            else {
                const readDb = yield (0, utils_1.default)(pathName);
                const dbParsedObj = JSON.parse(readDb);
                const dataBaseObj = { value: dbParsedObj, error: null };
                return dataBaseObj;
            }
        }
        catch (err) {
            console.error(err);
            const errorObj = { value: null, error: err };
            return errorObj;
        }
    });
}
exports.readAllAuthors = readAllAuthors;
//get specific author;
function readAuthor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        //read filepath
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                throw new Error('Something went wrong');
            }
            else {
                const readDb = yield (0, utils_1.default)(pathName);
                const authors = JSON.parse(readDb);
                const author = authors.find((item) => {
                    return item.id === Number(id);
                });
                ///check if author exists
                if (!author) {
                    const authorObj = { value: 'Author not available', error: true };
                    return authorObj;
                }
                else {
                    const authorObj = { value: author, error: false };
                    return authorObj;
                }
            }
        }
        catch (err) {
            console.error(err);
            const authorObj = { value: null, error: 'Request not completed' };
            return authorObj;
        }
    });
}
exports.readAuthor = readAuthor;
//edit update ---
function editAuthor(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //define path.
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                throw new Error('Something went wrong');
            }
            else {
                const readDb = yield (0, utils_1.default)(pathName); //read from database
                const { id, author, dateRegistered, age, address, books } = user; //destructure reqbody
                //destructure reqbody
                const authors = JSON.parse(readDb);
                //find the particular author to be edited.
                const authorIndex = authors.findIndex((item) => {
                    return item.id === Number(id);
                });
                //if author does not exist
                if (authorIndex === -1) {
                    throw new Error('Author not available');
                }
                else {
                    //modified... insert req body data to that of the database.
                    authors[authorIndex].address = address || authors[authorIndex].address;
                    authors[authorIndex].age = age || authors[authorIndex].age;
                    authors[authorIndex].author = author || authors[authorIndex].author;
                    //write back to the file;
                    fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong');
                        }
                        else {
                            const authorObj = { value: user, error: null };
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
exports.editAuthor = editAuthor;
//Delete Author
function removeAuthor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'database.json');
        try {
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                throw new Error('Something went wrong');
            }
            else {
                //read from database;
                const readDb = yield (0, utils_1.default)(pathName);
                const authors = JSON.parse(readDb);
                // find index of author;
                const authorIndex = authors.findIndex((item) => {
                    return item.id === Number(id);
                });
                //always check if the author exists
                if (authorIndex === -1) {
                    throw new Error('Author does not exist');
                }
                else {
                    authors.splice(authorIndex, 1);
                    //write back to database;
                    fs.writeFile(pathName, JSON.stringify(authors, null, 2), (err) => {
                        if (err) {
                            throw new Error('Something went wrong');
                        }
                        else {
                            const authorObj = { value: authors[authorIndex], error: null };
                            return authorObj;
                        }
                    });
                }
            }
        }
        catch (err) {
            console.error(err);
            const authorObj = { value: false, error: err };
            return authorObj;
        }
    });
}
exports.removeAuthor = removeAuthor;
//user resistration details
function regDetails(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'userdata.json');
        try {
            // check if database exists
            //if it does not exist
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                user.id = 1;
                const newUser = _.pick(user, [
                    'id',
                    'firstname',
                    'lastname',
                    'emailaddress',
                    'password',
                ]);
                newUser.password = yield (0, utils_1.hashPassword)(newUser.password);
                fs.writeFileSync(pathName, JSON.stringify([newUser], null, 2));
                //return data to user
                const uUser = _.pick(user, ['id', 'firstname', 'emailaddress']);
                const dataObj = { value: uUser, error: null };
                return dataObj;
            }
            //if it exists;
            if (fileExist) {
                const readDb = yield (0, utils_1.default)(pathName);
                const dataBaseObj = JSON.parse(readDb);
                ///check if user already exist
                const userExist = dataBaseObj.findIndex((item) => {
                    return item.emailaddress === user.emailaddress;
                });
                if (userExist !== -1) {
                    throw new Error('User already exist');
                }
                //else check for if the array is empty!
                if (dataBaseObj.length === 0) {
                    user.id = 1;
                    //write to database
                    const newUser = _.pick(user, [
                        'id',
                        'firstname',
                        'lastname',
                        'emailaddress',
                        'password',
                    ]);
                    newUser.password = yield (0, utils_1.hashPassword)(newUser.password); //---
                    dataBaseObj.push(newUser);
                    fs.writeFileSync(pathName, JSON.stringify(dataBaseObj, null, 2));
                    //return data to user
                    const uUser = _.pick(user, ['id', 'firstname', 'emailaddress']);
                    const dataObj = { value: uUser, error: null };
                    return dataObj;
                }
                //update user id and write back to database
                user.id = dataBaseObj[dataBaseObj.length - 1].id + 1;
                const newUser = _.pick(user, [
                    'id',
                    'firstname',
                    'lastname',
                    'emailaddress',
                    'password',
                ]);
                newUser.password = yield (0, utils_1.hashPassword)(newUser.password); //---
                dataBaseObj.push(newUser);
                fs.writeFileSync(pathName, JSON.stringify(dataBaseObj, null, 2));
                //return data to user;
                const uUser = _.pick(user, ['id', 'firstname', 'emailaddress']);
                // console.log(uUser);
                const dataObj = { value: uUser, error: null };
                return dataObj;
            }
        }
        catch (err) {
            const pathName = path_1.default.join(__dirname, 'userdata.json');
            const fileExist = fs.existsSync(pathName);
            if (!fileExist) {
                if (err) {
                    //update user
                    user.id = 1;
                    const newUser = _.pick(user, [
                        'id',
                        'firstname',
                        'lastname',
                        'emailaddress',
                        'password',
                    ]);
                    newUser.password = yield (0, utils_1.hashPassword)(newUser.password); //----
                    //write back to database
                    fs.writeFileSync(pathName, JSON.stringify([newUser], null, 2));
                    const uUser = _.pick(user, ['id', 'firstname', 'emailaddress']); //lodash;
                    //return data to user
                    const dataObj = { value: uUser, error: null };
                    return dataObj;
                }
                else {
                    const dataObj = { value: null, error: err };
                    return dataObj;
                }
            }
            console.error(err);
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.regDetails = regDetails;
//verifylogin;
function loginDetails(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.join(__dirname, 'userdata.json');
        try {
            const readDb = yield (0, utils_1.default)(pathName);
            const dataBaseObj = JSON.parse(readDb);
            const userData = dataBaseObj.find((item) => {
                return item.emailaddress === user.emailaddress;
            });
            return userData;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.loginDetails = loginDetails;
