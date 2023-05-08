import { Task, TaskStatus } from '../models/task';
import { filterTasks } from '../utils/filterTask';
import { saveTasks, loadTasks } from '../utils/localStorage';
import { fetchDogImage } from '../services/apiDog';
import { fetchCatImage } from '../services/apiCat';

class App {
  private taskInput: HTMLInputElement;
  private addTaskButton: HTMLButtonElement;
  private taskList: HTMLUListElement;
  private tasks: Task[];
  private selectedStatus: TaskStatus = "all";
  private footer: HTMLElement;

  constructor() {
    this.taskInput = document.querySelector(".add-task__input") as HTMLInputElement;
    this.addTaskButton = document.querySelector(".add-task__button") as HTMLButtonElement;
    this.taskList = document.querySelector(".add-task__list") as HTMLUListElement;
    this.footer = document.querySelector("footer") as HTMLElement;
    this.tasks = [];
  }

  public init(): void {
    this.loadTasksFromLocalStorage();
    this.addTaskButton.addEventListener("click", this.handleAddTaskButtonClick);
    const selectElement = document.querySelector('.filter__select') as HTMLSelectElement;
    selectElement.addEventListener('change', this.handleFilterSelectChange);
    this.displayCatImage();
    this.displayDogImage();
  }

  private loadTasksFromLocalStorage(): void {
    this.tasks = loadTasks();
    this.filterTasksAndUpdateList();
  }

  private saveTasksToLocalStorage(): void {
    saveTasks(this.tasks);
  }

  private async displayCatImage(): Promise<void> {
    const catImageURL = await fetchCatImage();
    const catImage = document.createElement("img");
    catImage.src = catImageURL;
    catImage.alt = "photo de chat un peu foufou"
    catImage.classList.add("animal-image");
    this.footer.appendChild(catImage);
  }

  private async displayDogImage(): Promise<void> {
    const dogImageURL = await fetchDogImage();
    const dogImage = document.createElement("img");
    dogImage.src = dogImageURL;
    dogImage.alt = "photo de chien qui fait waouf"
    dogImage.classList.add("animal-image");
    this.footer.appendChild(dogImage);
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
    const title = document.createElement("span");
    title.textContent = task.title;
    title.addEventListener("click", () => {
      this.handleTaskClick(listItem, title, task);
    });
    listItem.appendChild(title);

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
      this.saveTasksToLocalStorage();
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<span>&#10006;</span>';
    deleteButton.addEventListener("click", () => {
      this.deleteTask(task);
    });
    const containerButtons = document.createElement("div");
    containerButtons.appendChild(completeButton);
    containerButtons.appendChild(deleteButton);
    listItem.appendChild(containerButtons);
    this.taskList.appendChild(listItem);

    this.tasks.push(task);
    this.taskInput.value = "";
    this.saveTasksToLocalStorage();
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
      const title = document.createElement("span");
      title.textContent = task.title;
      title.addEventListener("click", () => {
        this.handleTaskClick(listItem, title, task);
      });
      listItem.appendChild(title);

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
        this.saveTasksToLocalStorage();
      });

      const deleteButton = document.createElement("button");
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = '<span>&#10006;</span>';
      deleteButton.addEventListener("click", () => {
        this.deleteTask(task);
      });
      const containerButtons = document.createElement("div");
      containerButtons.appendChild(completeButton);
      containerButtons.appendChild(deleteButton);
      listItem.appendChild(containerButtons);
      this.taskList.appendChild(listItem);
    });
  }

  private handleTaskClick(listItem: HTMLLIElement, title: HTMLSpanElement, task: Task): void {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.title;
  
    const updateTask = (): void => {
      const updatedTitle = input.value.trim();
      if (updatedTitle === "") {
        alert("La tâche ne peut pas être vide ;)");
        return;
      }
  
      const updatedTask: Task = {
        ...task,
        title: updatedTitle,
      };
  
      this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
      this.filterTasksAndUpdateList();
      this.saveTasksToLocalStorage();
    };
  
    input.addEventListener("blur", updateTask);
  
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        updateTask();
      }
    });
  
    listItem.replaceChild(input, title);
    input.focus();
  }  
  
  private deleteTask(task: Task): void {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.filterTasksAndUpdateList();
    this.saveTasksToLocalStorage();
  }
}

export { App };