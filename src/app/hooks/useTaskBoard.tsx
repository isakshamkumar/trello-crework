"use client"
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setTasks, updateTask, deleteTask } from '../store/slices/taskSlice';
import { Task, Status } from '../types';
import { apiUtils } from '../utils/apiUtils';

export const useTaskBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasksData = useCallback(async () => {
    try {
      const response = await apiUtils.fetchTasks();
      if (response.data.status === "success") {
        dispatch(setTasks(response.data.data.tasks));
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  const handleAddNew = (status: Status) => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdated = () => {
    fetchTasksData();
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiUtils.deleteTask(taskId);
      dispatch(deleteTask(taskId));
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const moveTask = async (draggedId: string, sourceStatus: Status, targetStatus: Status, targetIndex: number) => {
    const taskToMove = tasks.find(task => task.id === draggedId);
    if (taskToMove) {
      try {
        const response = await apiUtils.updateTaskStatus(draggedId, targetStatus);
        dispatch(updateTask(response.data.data.task));
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  return {
    tasks,
    isModalOpen,
    setIsModalOpen,
    editingTask,
    setEditingTask,
    handleAddNew,
    handleEditTask,
    handleTaskUpdated,
    handleDeleteTask,
    moveTask,
    getTasksByStatus,
  };
};