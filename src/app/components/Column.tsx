import React from "react";
import { useDrop } from "react-dnd";
import { Task, Status } from "../types";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

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
    drop: (item: { id: string, status: Status }) => {
      moveTask(item.id, item.status, status, tasks.length);
    },
  });

  return (
    <div ref={drop as any} className="bg-[#F9F9F9] p-4 rounded-lg min-w-96 w-fit">
      <h2 className="font-bold mb-4 flex items-center justify-between text-gray-700">
        {status.replace('_', ' ')}
      </h2>
      <div className="min-h-[10px] flex flex-col gap-3">
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

export default Column;