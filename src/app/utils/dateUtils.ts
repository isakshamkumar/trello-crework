import { formatDistanceToNow } from "date-fns";

export const displayRelativeDate = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDateForInput = (date: string | undefined) => {
  return date ? new Date(date).toISOString().split('T')[0] : '';
};