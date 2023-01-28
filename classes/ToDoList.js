import Validation from "./Validation.js";
import LocalStorage from "./LocalStorage.js";

class ToDoList {
  static maxLength = 25;
  constructor(settings) {
    this.items = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];
    this.maxLength = ToDoList.maxLength;
    this.ul = document.querySelector("ul");
    this.settings = settings;
  }

  init() {
    this.ul.addEventListener("click", this.handleEdit.bind(this));
    this.ul.addEventListener("click", this.handleToggleDone.bind(this));
    this.render();
  }

  set setItems(items) {
    this.items = items;
  }

  addItem(item) {
    if (!Validation.isValidLength(item)) {
      alert(
        "Please make sure your item is greater than 0 characters & less than 25 characters."
      );
      return;
    }

    if (this.items.length < this.maxLength) {
      this.items.push(item);
      LocalStorage.saveItem(item);
      this.render(item);
    } else {
      alert("You've reached the item limit.");
    }
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    LocalStorage.set("items", this.items);
    this.render();
  }

  handleEdit(e) {
    if (e.target.classList.contains("fa-pencil")) {
      let parent = e.target.parentNode.parentNode; // Get the parent li element
      let newInput = document.createElement("input");
      let index = this.items.indexOf(parent.textContent);
      console.log("INDEX: ", index);
      newInput.value = parent.textContent;

      parent.classList.remove("done");

      // Replace the li element with the input element
      parent.replaceChild(newInput, parent.firstChild);

      newInput.addEventListener("keyup", (e) =>
        this.handleEditConfirm(e, index)
      );
      newInput.focus();
    }
  }

  handleEditConfirm(e, index) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      let newText = document.createTextNode(e.target.value);
      if (Validation.isValidLength(newText)) {
        let parent = e.target.parentNode;
        this.items[index] = newText.textContent;
        parent.replaceChild(newText, e.target);
        LocalStorage.set("items", this.items);
      } else {
        e.target.classList.add("error");
        alert(
          "Please make sure your item is greater than 0 characters & less than 25 characters."
        );
      }
    }
  }

  handleToggleDone(e) {
    const target = e.target;
    if (target.matches("li:not(i)")) {
      target.classList.toggle("done");
    }
  }

  render(item) {
    this.ul.innerHTML = "";
    this.items.forEach((item) => {
      let li = document.createElement("li");
      let i1 = document.createElement("i");
      let i2 = document.createElement("i");
      let div = document.createElement("div");

      i1.classList.add("fa-solid", "fa-pencil");
      i2.classList.add("fa-solid", "fa-trash");

      li.innerText = item;
      div.appendChild(i1);
      div.appendChild(i2);
      li.appendChild(div);

      if (!this.settings.lines) {
        li.style.borderBottom = "none";
      }

      this.ul.appendChild(li);
      i2.addEventListener("click", () => this.removeItem(item));
    });
  }
}

export default ToDoList;
