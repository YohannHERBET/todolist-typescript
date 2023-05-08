import { filterTasks } from '../utils/filterTask';
import { Task } from '../models/task';

describe('filterTasks', () => {
  let tasks: Task[];

  beforeEach(() => {
    tasks = [
      { id: 1, title: 'Tâche 1', completed: true, startDate: new Date() },
      { id: 2, title: 'Tâche 2', completed: false, startDate: new Date() },
      { id: 3, title: 'Tâche 3', completed: false, startDate: new Date() },
      { id: 4, title: 'Tâche 4', completed: true, startDate: new Date() },
      { id: 5, title: 'Tâche 5', completed: true, startDate: new Date() },
    ];
  });

  test('Filtrer les tâches selon le statut "completed"', () => {
    const filteredTasks = filterTasks(tasks, 'completed');

    expect(filteredTasks.length).toBe(3);
    expect(filteredTasks.every((task) => task.completed === true)).toBe(true);
  });

  test('Filtrer les tâches selon le statut "onGoing"', () => {
    const filteredTasks = filterTasks(tasks, 'onGoing');

    expect(filteredTasks.length).toBe(2);
    expect(filteredTasks[0].completed).toBe(false);
  });
});
