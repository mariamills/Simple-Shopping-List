import Settings from "./classes/Settings.js";
import ToDoList from "./classes/ToDoList.js";

const settings = new Settings();
const todoList = new ToDoList(settings);
todoList.init();
settings.init();

const addBtn = document.querySelector(".addBtn");
const input = document.querySelector("input[type='text']");

//Event listener for add button
addBtn.addEventListener("click", () => {
  todoList.addItem(input.value);
  input.value = "";
});

//Event listener for Enter key pressed
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    todoList.addItem(input.value);
    input.value = "";
  }
});
