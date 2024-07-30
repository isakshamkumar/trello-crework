"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Calendar,
  Settings,
  Users,
  BarChart2,
  Download,
  Search,
  CalendarDays,
  Zap,
  Filter,
  Share,
  X,
  Clock,
  Flag,
  FileText,
  Plus,
  Star,
  LayoutGrid,
  Menu,
  Cross,
  ArrowBigDown,
  StarIcon,
  Loader,
  AlertTriangle,
  Pencil,
  MoveHorizontal,
  CircleHelp,
  Sparkles,
  Share2,
  BellDot,
  ChevronsRight,
  Trash,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { addTask, deleteTask, setTasks, updateTask } from "./store/slices/taskSlice";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "URGENT";
  deadline?: string;
  status: Status;
  updatedAt?: string;
}

type Status = "TODO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";

type TaskBoard = {
  [key in Status]: Task[];
};

interface DragItem {
  id: string;
  status: Status;
  index: number;
}

const initialTasks: TaskBoard = {
  TODO: [
    {
      id: "1",
      title: "Implement User Authentication",
      description:
        "Develop and integrate user authentication using email and password.",
      status: "TODO",
      priority: "URGENT",
      deadline: "2024-08-15",
      updatedAt: " 1 hr ago",
    },
    {
      id: "2",
      title: "Design Home Page UI",
      description:
        "Develop and integrate user authentication using email and password.",
      status: "TODO",
      priority: "MEDIUM",
      deadline: "2024-08-15",
      updatedAt: " 1 hr ago",
    },
    {
      id: "3",
      title: "Conduct User Feedback Survey",
      description: "Collect and analyze user feedback to improve app features.",
      status: "TODO",
      priority: "LOW",
      deadline: "2024-08-05",
      updatedAt: " 4 hr ago",
    },
  ],
  IN_PROGRESS: [
    {
      id: "4",
      title: "Design Home Page UI",
      description:
        "Develop and integrate user authentication using email and password.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      deadline: "2024-08-15",
      updatedAt: " 1 hr ago",
    },
    {
      id: "5",
      title: "Conduct User Feedback Survey",
      description: "Collect and analyze user feedback to improve app features.",
      status: "IN_PROGRESS",
      priority: "LOW",
      deadline: "2024-08-05",
      updatedAt: " 4 hr ago",
    },
  ],
  UNDER_REVIEW: [
    {
      id: "6",
      title: "Integrate Cloud Storage",
      description: "Enable cloud storage for note backup and synchronization.",
      status: "UNDER_REVIEW",
      priority: "URGENT",
      deadline: "2024-08-20",
      updatedAt: " 8 hr ago",
    },
  ],
  COMPLETED: [
    {
      id: "7",
      title: "Test Cross-browser Compatibility",
      description:
        "Ensure the app works seamlessly across different web browsers.",
      status: "COMPLETED",
      priority: "MEDIUM",
      deadline: "2024-07-30",
      updatedAt: " 12 hr ago",
    },
  ],
};

interface TaskCardProps {
  task: Task;
  index: number;
  moveTask: (draggedId: string, sourceStatus: Status, targetStatus: Status, targetIndex: number) => void;
  onEditTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, moveTask, onEditTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: string; status: Status; index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceStatus = item.status;
      const targetStatus = task.status;

      if (dragIndex === hoverIndex && sourceStatus === targetStatus) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTask(item.id, sourceStatus, targetStatus, hoverIndex);
      item.index = hoverIndex;
      item.status = targetStatus;
    },
  });

  drag(drop(ref));
const displayRelativeDate= (date: string) => {
  const newDate = new Date(date);
  return formatDistanceToNow(date, { addSuffix: true });
}

  return (
    <div
      ref={ref}
      onClick={() => onEditTask(task)}
      className={`bg-[#F9F9F9] border-2 border-[#DEDEDE] p-4 rounded-md shadow mb-2 ${
        isDragging ? "opacity-50" : ""
      } w-full min-h-[200px] h-fit`}
      style={{ cursor: "move" }}
    >
      <h3 className="font-normal text-black/70 text-sm">{task.title}</h3>
      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
      <div className="flex flex-col gap-3 mt-2">
        <span
          className={`text-xs px-3 py-2 rounded-lg block text-white w-fit ${
            task.priority === "URGENT"
              ? "bg-[#FF6B6B] "
              : task.priority === "MEDIUM"
              ? "bg-[#FFA235]"
              : "bg-[#0ECC5A]"
          }`}
        >
          {task.priority}
        </span>
        {task.deadline && (
          <span
           
            style={{ fontSize: "0.8rem" }}
            className="text-xs flex font-semibold items-center text-gray-500"
          >
            <Clock size={24} className="mr-2" />
            <span  suppressHydrationWarning>{task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''}</span>
          </span>
        )}
        {task.updatedAt && (
          <span
          suppressHydrationWarning
            style={{ fontSize: "0.8rem" }}
            className="text-xs flex font-medium items-center text-gray-500"
          >
            {displayRelativeDate(task.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};



interface ColumnProps {
  status: Status;
  tasks: Task[];
  moveTask: (draggedId: string, sourceStatus: Status, targetStatus: Status, targetIndex: number) => void;
  onAddNew: () => void;
  onEditTask: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, moveTask, onAddNew, onEditTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string, status: Status }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      moveTask(item.id, item.status, status, tasks.length);
    },
  });

  return (
    <div ref={drop} className="bg-[#F9F9F9] p-4 rounded-lg min-w-96 w-fit">
      <h2 className="font-bold mb-4 flex items-center justify-between text-gray-700">
        {status.replace('_', ' ')}
      </h2>
      <div className="min-h-[100px] flex flex-col gap-3">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
      <button
        onClick={onAddNew}
        className="mt-2 w-full bg-[#3A3A3A] text-gray-100 py-2 px-4 rounded-lg text-lg flex items-center justify-between hover:opacity-90"
      >
        Add new
        <Plus size={20} className="mr-2" />
      </button>
    </div>
  );
};


interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'URGENT';
  deadline?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: () => void;


}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState<Task['priority'] | ''>('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority || '');
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
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
    const taskData: any = {
      title,
      description,
    };

    if (status) taskData.status = status;
    if (priority) taskData.priority = priority;
    if (deadline) taskData.deadline = new Date(deadline + 'T00:00:00Z').toISOString();

    try {
      if (task && task.id) {
        const response = await axios.put(`http://localhost:5000/api/v1/tasks/${task.id}`, taskData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        dispatch(updateTask(response.data.data.task));
      } else {
        const response = await axios.post('http://localhost:5000/api/v1/tasks', taskData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
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
      try {
        await axios.delete(`http://localhost:5000/api/v1/tasks/${task.id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
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



type TaskBoardData = {
  [key in Status]: Task[];
};

const TaskBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/tasks', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.status === "success") {
        dispatch(setTasks(response.data.data.tasks));
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  },[dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [dispatch, fetchTasks]);

  const handleAddNew = (status: Status) => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const moveTask = async (draggedId: string, sourceStatus: Status, targetStatus: Status, targetIndex: number) => {
    const taskToMove = tasks.find(task => task.id === draggedId);
    console.log(taskToMove,'taskToMove')
    console.log(targetStatus,'targetStatus')
    
    if (taskToMove) {
      const updatedTask = { ...taskToMove, status: targetStatus };
      try {
        console.log('before request')
        
        const response = await axios.patch(`http://localhost:5000/api/v1/tasks/${draggedId}/status`, updatedTask, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        dispatch(updateTask(response.data.data.task));
      } catch (error) {
        console.error('Failed to update task status:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };
  const router = useRouter();
  return (
    <DndProvider backend={HTML5Backend}>
    <div className="flex h-screen relative bg-gray-100">
      <aside className="min-w-[17rem] bg-white p-4 flex flex-col text-gray-400 ">
        <div className="flex items-center mb-8">
          <img
            src="/avatar.png"
            alt="Joe Gardner"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">Joe Gardner</span>
        </div>
        <div className="flex justify-between items-center mb-8  ">
          <span className="flex justify-center items-center gap-2 text-gray-400">
            <BellDot size={20} className="mr-3" />
            <Loader size={20} className="mr-3" />
            <ChevronsRight size={20} className="mr-3" />
          </span>
          
            <button onClick={()=>{localStorage.removeItem('token');router.push('/login')}} className="bg-transparent px-3 py-2 rounded-md text-gray-600 bg-[#F4F4F4] flex gap-2 items-center">
              Logout
            </button>

        </div>
        <nav className="flex-grow flex flex-col gap-4">
          <a
            href="#"
            className="flex items-center font-medium py-2 px-4 focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
          >
            <Calendar size={20} className="mr-3" />
            Home
          </a>
          <a
            href="#"
            className="flex items-center font-medium py-2 px-4 focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
          >
            <LayoutGrid size={20} className="mr-3" />
            Boards
          </a>
          <a
            href="#"
            className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
          >
            <Settings size={20} className="mr-3" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
          >
            <Users size={20} className="mr-3" />
            Teams
          </a>
          <a
            href="#"
            className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
          >
            <BarChart2 size={20} className="mr-3" />
            Analytics
          </a>
          <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingTask(null);
          }}
          className="w-full bg-indigo-600 text-white py-3 px-4 flex gap-2 items-center justify-center rounded-md hover:bg-indigo-700"
        >
          Create new task
          <Plus
            size={24}
            className="mr-2 bg-white text-black rounded-full p-1"
          />
        </button>
        </nav>
       
        <button className="w-full mt-4 bg-gray-100 py-2 px-2 rounded flex gap-3 items-center justify-center">
          <Download size={25} />
          <div className="flex flex-col gap-1 items-center justify-center">
            <span className="text-slate-500 text-base font-medium">Download the app </span>
            <span style={{fontSize:'.7rem'}} className="text-slate-600 font-light -ml-5 ">
              Get the full experience
            </span>
          </div>
        </button>
      </aside>
      <main className=" p-8 px-8 relative ">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold mb-4 text-gray-800">
              Good morning, Joe!
            </h1>
            <div className="flex gap-2 mb-4 text-gray-800">
              Help & Feedback
              <CircleHelp size={20} />
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 ">
            <div className="bg-white p-2 rounded-lg mb-4 h-[10rem] flex-1 flex gap-2 justify-center items-center">
              <img
                src="/header-tags.png"
                alt="header-tags"
                className="w-20 h-16"
              />
              <div className="flex flex-col gap-2 m-0">
                <h3 className="text-gray-500 font-semibold">
                  Introducing tags
                </h3>
                <p className="text-gray-500 font-normal">
                  Easily categorize and find your notes by adding tags. Keep
                  your workspace clutter-free and efficient.
                </p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg mb-4 h-[10rem] flex-1 flex gap-2 justify-center items-center">
              <img
                src="/header-share.png"
                alt="header-tags"
                className="w-20 h-16"
              />
              <div className="flex flex-col gap-2 m-0">
                <h3 className="text-gray-500 font-semibold">
                  Share Notes Instantly
                </h3>
                <p className="text-gray-500 font-normal">
                  Effortlessly share your notes with others via email or link.
                  Enhance collaboration with quick sharing options.
                </p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg mb-4 h-[10rem] flex-1 flex gap-2 justify-center items-center">
              <img
                src="/header-access.png"
                alt="header-tags"
                className="w-20 h-16"
              />
              <div className="flex flex-col gap-2 m-0">
                <h3 className="text-gray-500 font-semibold">
                  Access Anywhere
                </h3>
                <p className="text-gray-500 font-normal">
                  Sync your notes across all devices. Stay productive whether
                  you're on your phone, tablet, or computer.
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mb-4 ">
            <div className="relative flex-grow ">
              <input
                type="text"
                placeholder="Search"
                className="w-[250px] border rounded-lg pl-2 pr-3 py-2 text-gray-700"
              />
              <Search
                size={20}
                className="absolute left-[13.5rem] top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button className="bg-transparent px-3 py-2 rounded-md text-gray-500 flex gap-2 items-center">
              Calendar view
              <CalendarDays size={20} className="mr-2" />
            </button>
            <button className="bg-transparent px-3 py-2 rounded-md text-gray-500 flex gap-2 items-center">
              Automation
              <Sparkles size={20} className="mr-2" />
            </button>
            <button className="bg-transparent px-3 py-2 rounded-md text-gray-500 flex gap-2 items-center">
              Filter
              <Filter size={20} className="mr-2" />
            </button>
            <button className="bg-transparent px-3 py-2 rounded-md text-gray-500 flex gap-2 items-center">
              Share
              <Share2 size={20} className="mr-2" />
            </button>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setEditingTask(null);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex gap-2 items-center"
            >
              Create new
              <Plus
                size={24}
                className="mr-2 bg-white text-black rounded-full p-1"
              />
            </button>
          </div>
        </header>
        <div className="flex bg-[#F9F9F9] p-4 space-x-4">
          {(['TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'] as Status[]).map((status) => (
            <Column
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              moveTask={moveTask}
              onAddNew={() => handleAddNew(status)}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </main>
    </div>
    <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />
  </DndProvider>
  );
};

export default TaskBoard;