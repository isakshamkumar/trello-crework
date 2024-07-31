"use client"
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Status } from '../types';
import { useTaskBoard } from '../hooks/useTaskBoard';
import Sidebar from './Sidebar';
import Header from './Header';
import Column from './Column';
import TaskModal from './TaskModal';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useRouter } from "next/navigation"

const TaskBoard: React.FC = () => {
  const {
    tasks,
    isModalOpen,
    setIsModalOpen,
    editingTask,
    setEditingTask,
    handleAddNew,
    handleEditTask,
    handleTaskUpdated,
    moveTask,
    getTasksByStatus,
  } = useTaskBoard();

  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    router.push("/login");
    return null; 
  }
if(user){
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen relative bg-gray-100">
        <Sidebar />
        <main className="p-8 px-8 relative flex-grow">
          <Header
            onCreateNew={() => {
              setIsModalOpen(true);
              setEditingTask(null);
            }}
          />
          
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
}
 
};

export default TaskBoard;
