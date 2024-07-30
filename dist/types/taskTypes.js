"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus),
    priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
    deadline: zod_1.z.string().datetime().optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
exports.updateTaskStatusSchema = zod_1.z.object({
    id: zod_1.z.string(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus),
});
