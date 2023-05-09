import { Task, TaskStatus } from '../models/task';

export const filterTasks = (tasks: Task[], status: TaskStatus): Task[] => {
  switch (status) {
    case 'completed':
      return tasks.filter((task) => task.completed);
    case 'onGoing':
      return tasks.filter((task) => !task.completed)
    case 'all':
    default:
      return tasks;
  }
};

export const searchTasks = (tasks: Task[], keyword: string): Task[] => {
  const lowerCaseKeyword = keyword.toLocaleLowerCase();
  return tasks.filter((task) => task.title.toLocaleLowerCase().includes(lowerCaseKeyword));
};