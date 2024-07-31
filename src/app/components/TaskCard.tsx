"use client"
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Task, Status, DragItem } from "../types";
import { Clock } from "lucide-react";
import { displayRelativeDate, formatDateForInput } from "../utils/dateUtils";

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
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceStatus = item.status;
      const targetStatus = task.status;

      if (dragIndex === hoverIndex && sourceStatus === targetStatus) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(item.id, sourceStatus, targetStatus, hoverIndex);
      item.index = hoverIndex;
      item.status = targetStatus;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={() => onEditTask(task)}
      className={`bg-[#F9F9F9] border-2 border-[#DEDEDE] p-4 rounded-md shadow mb-2 ${
        isDragging ? "opacity-50" : ""
      } w-full min-h-[50px]  h-fit cursor-move`}
    >
      <h3 className="font-normal text-black/70 text-sm">{task.title}</h3>
      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
      <div className="flex flex-col gap-3 mt-2">
        <span
          className={`text-xs px-3 py-2 rounded-lg block text-white w-fit ${
            task.priority === "URGENT"
              ? "bg-[#FF6B6B]"
              : task.priority === "MEDIUM"
              ? "bg-[#FFA235]"
              : "bg-[#0ECC5A]"
          }`}
        >
          {task.priority}
        </span>
        {task.deadline && (
          <span className="text-xs flex font-semibold items-center text-gray-500">
            <Clock size={24} className="mr-2" />
            <span suppressHydrationWarning>{formatDateForInput(task.deadline)}</span>
          </span>
        )}
        {task.updatedAt && (
          <span suppressHydrationWarning className="text-xs flex font-medium items-center text-gray-500">
            {displayRelativeDate(task.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;