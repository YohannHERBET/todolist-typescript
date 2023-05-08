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
  }
}

export { App };