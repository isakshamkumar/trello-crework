import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'URGENT';
  deadline?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
    console.log(`Rendering TaskCard for task: ${task.id}, index: ${index}`);
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => {
          console.log(`Draggable props for task ${task.id}:`, provided.draggableProps);
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-slate-500 p-4 rounded shadow mb-2"
            >
              <h3 className="font-bold">{task.title}</h3>
              {task.description && <p className="text-sm">{task.description}</p>}
              <div className="flex justify-between mt-2">
                <span className="text-xs">{task.priority}</span>
                {task.deadline && <span className="text-xs">{new Date(task.deadline).toLocaleDateString()}</span>}
              </div>
            </div>
          );
        }}
      </Draggable>
    );
  };

interface ColumnProps {
  title: string;
  tasks: Task[];
  id: string;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, id }) => {
  console.log(`Rendering Column: ${id}, Tasks:`, tasks);
  return (
    <div className="bg-slate-400 p-4 rounded-lg w-64">
      <h2 className="font-bold mb-4">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px] bg-red-500"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;