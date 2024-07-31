import axios from "axios";

const API_BASE_URL = "https://trello-backend-zx3d.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window!=="undefined" ? localStorage.getItem("token"):'';
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTasks = () => api.get("/tasks");
export const createTask = (taskData: any) => api.post("/tasks", taskData);
export const updateTask = (taskId: string, taskData: any) => api.put(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId: string) => api.delete(`/tasks/${taskId}`);
export const updateTaskStatus = (taskId: string, status: string) => api.patch(`/tasks/${taskId}/status`, { status });

export const apiUtils = {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};

export default apiUtils;