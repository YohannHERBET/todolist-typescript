import { App } from '../components/App';

describe('Tests de App', () => {
  let app: App;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="add-task">
        <input class="add-task__input" type="text" />
        <button class="add-task__button">Ajouter</button>
      </div>
      <ul class="add-task__list"></ul>
      <select class="filter__select">
        <option value="all">Toutes</option>
        <option value="completed">Terminées</option>
        <option value="active">Actives</option>
      </select>
    `;
    app = new App();
    app.init();
  });

  test('Ajouter une tâche', () => {
    const taskInput = document.querySelector('.add-task__input') as HTMLInputElement;
    const addTaskButton = document.querySelector('.add-task__button') as HTMLButtonElement;
    const taskList = document.querySelector('.add-task__list') as HTMLUListElement;
  
    const initialTaskCount = taskList.childElementCount;
  
    taskInput.value = 'Tâche 1';
    addTaskButton.click();
  
    const updatedTaskCount = taskList.childElementCount;
    const newTask = taskList.lastChild as HTMLLIElement;
  
    expect(updatedTaskCount).toBe(initialTaskCount + 1);
    expect(newTask.textContent?.trim().replace('Terminer✖', '')).toBe('Tâche 1');
  });
  
  test('Filtrer les tâches si le statut est "completed"', () => {
    const taskInput = document.querySelector('.add-task__input') as HTMLInputElement;
    const addTaskButton = document.querySelector('.add-task__button') as HTMLButtonElement;
    const filterSelect = document.querySelector('.filter__select') as HTMLSelectElement;
    const taskList = document.querySelector('.add-task__list') as HTMLUListElement;

    taskInput.value = 'Tâche 1';
    addTaskButton.click();

    taskInput.value = 'Tâche 2';
    addTaskButton.click();

    taskInput.value = 'Tâche 3';
    addTaskButton.click();

    taskInput.value = 'Tâche 4';
    addTaskButton.click();

    const completeButtons = taskList.querySelectorAll('button:nth-child(1)');
    completeButtons[0].dispatchEvent(new Event('click'));
    completeButtons[1].dispatchEvent(new Event('click'));
    completeButtons[2].dispatchEvent(new Event('click'));

    filterSelect.value = "completed";
    filterSelect.dispatchEvent(new Event('change'));

    expect(taskList.childElementCount).toBe(3);
    Array.from(taskList.children).forEach((task) => {
      const taskTitle = task.querySelector('span')?.textContent;
      expect(taskTitle).toBeTruthy();
      expect(taskTitle).not.toBe('Tâche 4');
    });
  });
});