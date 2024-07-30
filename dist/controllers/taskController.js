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
exports.updateTaskStatus = exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const taskTypes_1 = require("../types/taskTypes");
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
const getZodErrorMessage_1 = __importDefault(require("../utils/getZodErrorMessage"));
const mongodb_1 = require("mongodb");
const isValidObjectId = (id) => {
    return mongodb_1.ObjectId.isValid(id);
};
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = taskTypes_1.createTaskSchema.parse(req.body);
        const task = yield prisma_1.default.task.create({
            data: Object.assign(Object.assign({}, data), { userId: req.user.id }),
        });
        res.status(201).json({ status: "success", data: { task } });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessage = (0, getZodErrorMessage_1.default)(error);
            return res.status(400).json({ message: errorMessage });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield prisma_1.default.task.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ status: "success", data: { tasks } });
    }
    catch (error) {
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.getTasks = getTasks;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const task = yield prisma_1.default.task.findUnique({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ status: "success", data: { task } });
    }
    catch (error) {
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.getTask = getTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const data = taskTypes_1.updateTaskSchema.parse(req.body);
        const task = yield prisma_1.default.task.update({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
            data: Object.assign({}, data),
        });
        res.json({ status: "success", data: { task } });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessage = (0, getZodErrorMessage_1.default)(error);
            return res.status(400).json({ message: errorMessage });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        yield prisma_1.default.task.delete({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.deleteTask = deleteTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const data = taskTypes_1.updateTaskStatusSchema.parse(Object.assign(Object.assign({}, req.body), { id: req.params.id }));
        const task = yield prisma_1.default.task.update({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
            data: {
                status: data.status,
            },
        });
        res.json({ status: "success", data: { task } });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessage = (0, getZodErrorMessage_1.default)(error);
            return res.status(400).json({ message: errorMessage });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.updateTaskStatus = updateTaskStatus;
