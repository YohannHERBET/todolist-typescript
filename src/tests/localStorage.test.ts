import { saveTasks, loadTasks } from '../utils/localStorage';
import { Task } from '../models/task';
import 'jest-localstorage-mock';

describe('Tests du local storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Sauvegarder les tâches dans le local storage', () => {
    const tasks: Task[] = [
      { id: 1, title: 'Tâche 1', completed: true, startDate: new Date() },
      { id: 2, title: 'Tâche 2', completed: false, startDate: new Date() },
      { id: 3, title: 'Tâche 3', completed: false, startDate: new Date() },
      { id: 4, title: 'Tâche 4', completed: true, startDate: new Date() },
      { id: 5, title: 'Tâche 5', completed: true, startDate: new Date() },
    ];

    saveTasks(tasks);

    const tasksJSON = localStorage.getItem('tasks');
    const savedTasks = JSON.parse(tasksJSON || '', (key, value) => {
      if (key === 'startDate') {
        return new Date(value).toISOString();
      }
      return value;
    });

    expect(JSON.stringify(savedTasks)).toEqual(JSON.stringify(tasks));
  });

  test('Charger les tâches depuis le local storage', () => {
    const tasks: Task[] = [
      { id: 1, title: 'Tâche 1', completed: true, startDate: new Date() },
      { id: 2, title: 'Tâche 2', completed: false, startDate: new Date() },
      { id: 3, title: 'Tâche 3', completed: false, startDate: new Date() },
      { id: 4, title: 'Tâche 4', completed: true, startDate: new Date() },
      { id: 5, title: 'Tâche 5', completed: true, startDate: new Date() },
    ];

    const tasksJSON = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksJSON);

    const loadedTasks = loadTasks();

    expect(JSON.stringify(loadedTasks)).toEqual(JSON.stringify(tasks));
  });

  test('Retourner un tableau vide si aucune tâche n\'est présente dans le local storage', () => {
    const loadedTasks = loadTasks();

    expect(loadedTasks).toEqual([]);
  });
});
