"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import {
  Calendar,
  Settings,
  Users,
  BarChart2,
  Download,
  Plus,
  LayoutGrid,
  BellDot,
  Loader,
  ChevronsRight
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link"
import { useTaskBoard } from '../hooks/useTaskBoard';
const Sidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  const { setIsModalOpen,setEditingTask} =useTaskBoard()

  return (
    <aside className="min-w-[15rem] bg-white p-4 flex flex-col text-gray-400 ">
    <div className="flex items-center mb-8">
      <Image
      height={10}
      width={10}
        src="/avatar.png"
        alt="Joe Gardner"
        className="w-10 h-10 rounded-full mr-3"
      />
      <span className="font-semibold">{user?.fullName || 'User'}</span>
    </div>
    <div className="flex justify-between items-center mb-8  ">
      <span className="flex justify-center items-center gap-2 text-gray-400">
        <BellDot size={20} className="mr-3" />
        <Loader size={20} className="mr-3" />
        <ChevronsRight size={20} className="mr-3" />
      </span>
      
      
      <button onClick={handleLogout} className="bg-transparent px-3 py-2 rounded-md text-gray-600 bg-[#F4F4F4] flex gap-2 items-center">
        Logout
      </button>

    </div>
    <nav className="flex-grow flex flex-col gap-4">
      <Link
        href="#"
        className="flex items-center font-medium py-2 px-4 focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
      >
        <Calendar size={20} className="mr-3" />
        Home
      </Link>
      <Link
        href="#"
        className="flex items-center font-medium py-2 px-4 focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
      >
        <LayoutGrid size={20} className="mr-3" />
        Boards
      </Link>
      <Link
        href="#"
        className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
      >
        <Settings size={20} className="mr-3" />
        Settings
      </Link>
      <Link
        href="#"
        className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
      >
        <Users size={20} className="mr-3" />
        Teams
      </Link>
      <Link
        href="#"
        className="flex items-center font-medium py-2 px-4  focus:bg-gray-100  hover:bg-gray-100 focus:border focus:border-gray-200  rounded"
      >
        <BarChart2 size={20} className="mr-3" />
        Analytics
      </Link>
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

  );
}

export default Sidebar