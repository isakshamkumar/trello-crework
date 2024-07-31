"use client"
import React, { useState, useEffect , useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { X, Share, Star, Clock, AlertTriangle, Calendar, Pencil, Trash } from 'lucide-react';
import { Task, Status } from '../types';
import axios from 'axios';
import { formatDateForInput } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const modalTitleInputRef= useRef()
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState<Task['priority'] | ''>('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if(modalTitleInputRef && modalTitleInputRef.current){
      //@ts-ignore
      modalTitleInputRef?.current?.focus()

    }
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority || '');
      setDeadline(formatDateForInput(task.deadline));
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('');
    setPriority('');
    setDeadline('');
  };

  const handleSave = async () => {
    if(title ==="" || description==="" || status==="" || priority===""){
      alert("Please Provide the Complete Task Details")
    }
    const taskData: any = {
      title,
      description,
    };

    if (status) taskData.status = status;
    if (priority) taskData.priority = priority;
    if (deadline) taskData.deadline = new Date(deadline + 'T00:00:00Z').toISOString();

    try {
      let token;
      if(typeof window!=="undefined"){
token= localStorage.getItem("token")
      }else{
        token=""
      }
      if (task && task.id) {
        const response = await axios.put(`https://trello-backend-zx3d.onrender.com/api/v1/tasks/${task.id}`, taskData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
        });
        dispatch(updateTask(response.data.data.task));
      } else {
        const response = await axios.post('https://trello-backend-zx3d.onrender.com/api/v1/tasks', taskData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
        });
        dispatch(addTask(response.data.data.task));
      }
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = async () => {
    if (task && task.id) {

        let token;
        if(typeof window!=="undefined"){
  token= localStorage.getItem("token")
        }else{
          token=""
        }
      try {
        console.log('in delete');
        
        await axios.delete(`https://trello-backend-zx3d.onrender.com/api/v1/tasks/${task.id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        dispatch(deleteTask(task.id));
        onTaskUpdated();
        onClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[35vw] bg-white shadow-lg p-6 overflow-y-auto">
    <div className="flex justify-between mb-4">
      <div className="flex gap-4 items-center">
        <X onClick={onClose} size={20} className="text-gray-500 mr-2 hover:cursor-pointer" />
      </div>
      <div className="flex justify-between gap-2 items-center">
        <button className="text-gray-500 bg-gray-200 p-2 rounded-md hover:text-gray-700 flex items-center gap-1">
          Share
          <Share size={20} />
        </button>
        <button className="text-gray-500 bg-gray-200 p-2 rounded-md hover:text-gray-700 flex items-center gap-1">
          Favorite
          <Star size={20} />
        </button>
      </div>
    </div>
    <input
    ref={modalTitleInputRef as any}
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full p-2 mb-6 focus:outline-none placeholder:text-gray-400 text-gray-400 text-4xl font-semibold"
    />
    <div className="space-y-4 w-[25rem]">
      <div className="flex justify-between items-center">
        <div className="text-gray-400 mb-2 flex items-center gap-2">
          <Clock size={20} className="text-gray-400 mr-2" />
          Status
        </div>
        <select
          className="bg-transparent text-slate-500 active:border-none focus:outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="" disabled selected>Not selected</option>
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-gray-400 mb-2 flex items-center gap-2">
          <AlertTriangle size={20} className="text-gray-400 mr-2" />
          Priority
        </div>
        <select
          className="bg-transparent text-slate-500 active:border-none focus:outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
        >
          <option value="" disabled selected>Not selected</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-gray-400 mb-2 flex items-center gap-2">
          <Calendar size={20} className="text-gray-400 mr-2" />
          Deadline
        </div>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="bg-transparent text-slate-500 active:border-none focus:outline-none"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-gray-400 mb-2 flex items-center gap-2">
          <Pencil size={20} className="text-gray-400 mr-2" />
          Description
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          className="bg-transparent border-b resize-none overflow-hidden w-1/2 text-slate-500 active:border-none focus:outline-none"
        />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      {task && task.id && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
        >
          <Trash size={20} />
          Delete
        </button>
      )}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  </div>
  );
};

export default TaskModal;