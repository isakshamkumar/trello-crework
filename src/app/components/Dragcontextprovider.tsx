// components/DragDropContextProvider.tsx
"use client";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface DragDropContextProviderProps {
  onDragEnd: (result: DropResult) => void;
  children: React.ReactNode;
}

const DragDropContextProvider: React.FC<DragDropContextProviderProps> = ({ onDragEnd, children }) => {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

export default DragDropContextProvider;