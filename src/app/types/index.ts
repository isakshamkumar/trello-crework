export type Status = "TODO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";
export type Priority = "LOW" | "MEDIUM" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  deadline?: string;
  status: Status;
  updatedAt?: string;
}

export interface DragItem {
  id: string;
  status: Status;
  index: number;
}