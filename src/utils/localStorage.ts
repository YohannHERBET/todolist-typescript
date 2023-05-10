import { Task } from "../models/task";

const STORAGE_KEY = 'tasks' as const;

export const saveTasks = (tasks: Task[]): void => {
  const tasksJSON = JSON.stringify(tasks);
  localStorage.setItem(STORAGE_KEY, tasksJSON);
};

export const loadTasks = (): Task[] => {
  const tasksJSON = localStorage.getItem(STORAGE_KEY);
  if (tasksJSON) {
    return JSON.parse(tasksJSON);
  }
  return [];
};
