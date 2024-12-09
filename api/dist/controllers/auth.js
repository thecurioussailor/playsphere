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
exports.userLogin = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        res.status(400).json({ message: "Validation errors" });
        return;
    }
    const existingUser = yield db_1.prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    });
    if (existingUser) {
        res.status(409).json({
            error: "Username or email already exists"
        });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield db_1.prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "8h" });
    res.status(201).json({
        access_token: token,
        message: "User successfully registered",
    });
});
exports.createUser = createUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            message: "Validation errors"
        });
        return;
    }
    const user = yield db_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(404).json({ error: "Invalid email or password" });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "8h" });
    res.status(200).json({
        access_token: token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    });
});
exports.userLogin = userLogin;
