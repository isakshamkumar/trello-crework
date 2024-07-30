"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
router.use(authMiddleware_1.userAuthMiddleware);
router.post('/', taskController_1.createTask);
router.get('/', taskController_1.getTasks);
router.get('/:id', taskController_1.getTask);
router.put('/:id', taskController_1.updateTask);
router.delete('/:id', taskController_1.deleteTask);
router.patch('/:id/status', taskController_1.updateTaskStatus);
exports.default = router;
