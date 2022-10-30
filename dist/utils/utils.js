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
exports.logout = exports.hashPassword = exports.validateLoginInput = exports.validateRegistrationInput = void 0;
const fs = __importStar(require("fs"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function readDataFile(filepath) {
    return new Promise((resolve, reject) => {
        let data = '';
        let readStream = fs.createReadStream(filepath, 'utf8');
        //reading in chunks
        readStream.on('data', (chunk) => {
            data += chunk;
        });
        // on end
        readStream.on('end', () => {
            return resolve(data);
        });
        // on error
        readStream.on('error', (error) => {
            return reject(error);
        });
    });
}
exports.default = readDataFile;
//---Validate registered user  details.
function validateRegistrationInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //define a schema;
        const schema = joi_1.default.object({
            id: joi_1.default.number(),
            firstname: joi_1.default.string().min(2).required(),
            lastname: joi_1.default.string().min(2).required(),
            emailaddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
            confirmPassword: joi_1.default.ref('password'),
        });
        return schema.validate(user);
    });
}
exports.validateRegistrationInput = validateRegistrationInput;
//--Validate login users;
function validateLoginInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object({
            emailaddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
        });
        return schema.validate(user);
    });
}
exports.validateLoginInput = validateLoginInput;
//hashing passwords
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        return hashed;
    });
}
exports.hashPassword = hashPassword;
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
exports.logout = (function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie('token', '');
        req.cookies.token = '';
        res.cookie('user', '');
        req.cookies.user = '';
        // res.cookie(req.cookies.token, '') 
        res.status(200).redirect('/users/login');
    });
});
