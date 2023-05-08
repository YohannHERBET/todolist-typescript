import { Task, TaskStatus } from '../models/task';
import { filterTasks } from '../utils/filterTask';

class App {
  private taskInput: HTMLInputElement;
  private addTaskButton: HTMLButtonElement;
  private taskList: HTMLUListElement;
  private tasks: Task[];
  private selectedStatus: TaskStatus = "all";

  constructor() {
    this.taskInput = document.querySelector(".add-task__input") as HTMLInputElement;
    this.addTaskButton = document.querySelector(".add-task__button") as HTMLButtonElement;
    this.taskList = document.querySelector(".add-task__list") as HTMLUListElement;
    this.tasks = [];
  }

  public init(): void {
    this.addTaskButton.addEventListener("click", this.handleAddTaskButtonClick);
    const selectElement = document.querySelector('.filter__select') as HTMLSelectElement;
    selectElement.addEventListener('change', this.handleFilterSelectChange);
  }

  private handleAddTaskButtonClick = (e: Event): void => {
    e.preventDefault();
    this.addTask();
  };

  private handleFilterSelectChange = (): void => {
    const selectElement = document.querySelector('.filter__select') as HTMLSelectElement;
    this.selectedStatus = selectElement.value as TaskStatus;
    this.filterTasksAndUpdateList();
  };

  private addTask(): void {
    const taskText = this.taskInput.value.trim();

    if (taskText === "") {
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: taskText,
      startDate: new Date(),
      completed: false,
    };

    const listItem = document.createElement("li");
    listItem.textContent = task.title;

    const completeButton = document.createElement("button");
    completeButton.textContent = "Terminer";
    completeButton.addEventListener("click", () => {
      const updatedTask: Task = {
        ...task,
        completed: true,
      };

      this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
      completeButton.textContent = "Reprendre";
      listItem.classList.add("completed");

      this.filterTasksAndUpdateList();
    });

    listItem.appendChild(completeButton);
    this.taskList.appendChild(listItem);

    this.tasks.push(task);
    this.taskInput.value = "";
  }

  private filterTasksAndUpdateList(): void {
    let filteredTasks: Task[];

    if (this.selectedStatus === "completed") {
      filteredTasks = this.tasks.filter((task) => task.completed);
    } else {
      filteredTasks = filterTasks(this.tasks, this.selectedStatus);
    }

    this.updateTaskList(filteredTasks);
  }

  private updateTaskList(tasks: Task[]): void {
    this.taskList.innerHTML = "";

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.textContent = task.title;

      const completeButton = document.createElement("button");
      completeButton.textContent = task.completed ? "Reprendre" : "Terminer";
      completeButton.addEventListener("click", () => {
        const updatedTask: Task = {
          ...task,
          completed: !task.completed,
        };

        this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
        completeButton.textContent = updatedTask.completed ? "Reprendre" : "Terminer";
        listItem.classList.toggle("completed");

        this.filterTasksAndUpdateList();
      });

      listItem.appendChild(completeButton);
      this.taskList.appendChild(listItem);
    });
  }
}

export { App };