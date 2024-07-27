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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const config_1 = require("../config/config");
const getZodErrorMessage_1 = __importDefault(require("../utils/getZodErrorMessage"));
const signupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, 'Full name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = signupSchema.parse(req.body);
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, config_1.config.bcryptSaltRounds);
        const user = yield prisma_1.default.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.config.jwtSecret, {
            expiresIn: config_1.config.jwtExpiresIn,
        });
        res.status(201).json({
            status: 'success',
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessage = (0, getZodErrorMessage_1.default)(error);
            return res.status(400).json({ message: errorMessage });
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    }
});
exports.signup = signup;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.config.jwtSecret, {
            expiresIn: config_1.config.jwtExpiresIn,
        });
        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
                token,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
});
exports.login = login;
