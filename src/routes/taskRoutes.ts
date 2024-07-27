import express from 'express';
import { userAuthMiddleware } from '../middleware/authMiddleware';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController';

const router = express.Router();

router.use(userAuthMiddleware);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTask);

export default router;