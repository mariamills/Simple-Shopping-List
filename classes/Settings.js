import LocalStorage from "./LocalStorage.js";
import ToDoList from "./ToDoList.js";
import Validation from "./Validation.js";
const todo = new ToDoList();

class Settings {
  constructor() {
    this.initializeElements();
    this.color = LocalStorage.get("color") || "#87ceeb";
    this.gradient =
      LocalStorage.get("gradient") === null
        ? true
        : LocalStorage.get("gradient");
    this.showBtn =
      LocalStorage.get("showBtn") === null ? true : LocalStorage.get("showBtn");
    this.showLines =
      LocalStorage.get("lines") === null ? true : LocalStorage.get("lines");
    this.showSettings = LocalStorage.get("settings");
    this.uploadedFile = undefined;
    this.uploadedImage = LocalStorage.get("uploadedImage");
    this.orienation = LocalStorage.get("orienation");
    this.direction = LocalStorage.get("direction") || "to right";
    this.title = LocalStorage.get("title") || "QuickList";
  }

  init() {
    this.colorInput.value = this.color;
    this.toggleGradient.checked = this.gradient;
    this.toggleBtn.checked = this.showBtn;
    this.toggleLines.checked = this.showLines;

    this.addBtn.hidden = !this.showBtn;

    this.colorInput.addEventListener(
      "input",
      this.handleColorChange.bind(this)
    );
    this.toggleGradient.addEventListener(
      "click",
      this.handleGradientChange.bind(this)
    );
    this.toggleLines.addEventListener(
      "click",
      this.handleLinesChange.bind(this)
    );
    this.toggleSettings.addEventListener(
      "click",
      this.handleSettingsChange.bind(this)
    );
    this.orienationDirections.forEach((item) =>
      item.addEventListener("click", this.handleOrienationChange.bind(this))
    );
    this.editTitle.addEventListener("click", this.handleTitleChange.bind(this));

    this.applyColor();
    this.applyGradient();
    this.applyLines();

    if (this.title) {
      this.titleElement.innerText = this.title;
    }

    if (this.showSettings) {
      this.sidebar.classList.add("toggle");
    }

    if (this.uploadedImage) {
      this.body.style.backgroundImage = LocalStorage.get("uploadedImage");
    }

    this.clear.addEventListener("click", this.handleClear.bind(this));
    this.reset.addEventListener("click", this.handleReset.bind(this));
    this.remove.addEventListener("click", this.handleRemove.bind(this));
    this.fileInput.addEventListener("change", this.handleFile.bind(this));
    this.upload.addEventListener("click", this.handleUpload.bind(this));
    this.toggleBtn.addEventListener(
      "click",
      this.handleToggleChange.bind(this)
    );
  }

  initializeElements() {
    this.colorInput = document.querySelector("input[type='color']");
    this.toggleGradient = document.getElementById("toggleGradient");
    this.toggleLines = document.getElementById("toggleLines");
    this.toggleBtn = document.getElementById("toggleBtn");
    this.toggleSettings = document.getElementById("settings");
    this.clear = document.getElementById("clear");
    this.reset = document.getElementById("reset");
    this.remove = document.getElementById("remove");
    this.fileInput = document.getElementById("file");
    this.fileName = document.getElementById("file-name");
    this.titleElement = document.getElementById("title");
    this.edit = document.getElementById("edit-title");
    this.upload = document.getElementById("upload");
    this.sidebar = document.querySelector(".sidebar");
    this.addBtn = document.querySelector(".addBtn");
    this.editTitle = document.querySelector(".fa-pen-to-square");
    this.body = document.querySelector("body");
    this.orienationDirections = document.querySelectorAll(".orienation");
  }

  get lines() {
    return this.toggleLines.checked;
  }

  handleColorChange() {
    this.color = this.colorInput.value;
    LocalStorage.set("color", this.color);
    this.applyColor();
  }

  handleGradientChange() {
    this.gradient = this.toggleGradient.checked;
    this.toggleGradient.checked = this.gradient;
    LocalStorage.set("gradient", this.gradient);
    this.applyGradient();
  }

  handleLinesChange() {
    LocalStorage.set("lines", this.toggleLines.checked);
    this.applyLines();
  }

  handleClear() {
    todo.setItems = [];
    LocalStorage.clearList();
    location.reload();
  }

  handleReset() {
    todo.setItems = [];
    LocalStorage.clear();
    location.reload();
  }

  handleRemove() {
    localStorage.removeItem("uploadedImage");
    localStorage.removeItem("uploadedFile");
    location.reload();
  }

  handleFile(e) {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      fileExtension === "webp"
    ) {
      this.fileName.textContent = fileName;
      this.uploadedFile = file;
    } else {
      this.fileName.textContent = "File must be an image.";
    }
  }

  handleUpload() {
    const reader = new FileReader();
    if (this.uploadedFile) {
      reader.addEventListener("load", () => {
        let uploadedImage = reader.result;
        this.body.style.backgroundImage = `url(${uploadedImage})`;
        LocalStorage.set("uploadedImage", `url(${uploadedImage})`);
      });
      reader.readAsDataURL(this.uploadedFile);
      this.upload.blur();
    } else {
      this.fileName.textContent = "No valid uploaded file.";
    }
  }

  handleToggleChange() {
    this.showBtn = this.toggleBtn.checked;
    this.toggleBtn.checked = this.showBtn;
    LocalStorage.set("showBtn", this.showBtn);
    this.addBtn.hidden = !this.showBtn;
  }

  handleSettingsChange() {
    LocalStorage.set("settings", !this.sidebar.classList.contains("toggle"));
    this.sidebar.classList.toggle("toggle");
  }

  handleOrienationChange(e) {
    this.orienation = true;
    LocalStorage.set("orienation", this.orienation);
    this.applyOrienation(e);
  }

  handleTitleChange() {
    const newInput = document.createElement("input");
    const parent = this.edit.parentNode;
    parent.replaceChild(newInput, this.edit);
    newInput.addEventListener("keyup", (e) => this.handleTitleConfirm(e));
    newInput.focus();
  }

  handleTitleConfirm(e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      let newTitle = e.target.value;
      const parent = e.target.parentNode;
      if (Validation.isValidLength(newTitle)) {
        this.titleElement.innerText = newTitle;
        parent.replaceChild(this.edit, e.target);
        LocalStorage.set("title", newTitle);
      } else {
        e.target.classList.add("error");
        alert(
          "Please make sure your item is greater than 0 characters & less than 25 characters."
        );
      }
    }
  }

  applyOrienation(e) {
    const target = e.target.classList;
    if (target.contains("fa-arrow-up")) {
      this.direction = "to top";
      LocalStorage.set("direction", "to top");
    }
    if (target.contains("fa-arrow-down")) {
      this.direction = "to bottom";
      LocalStorage.set("direction", "to bottom");
    }
    if (target.contains("fa-arrow-left")) {
      this.direction = "to left";
      LocalStorage.set("direction", "to left");
    }
    if (target.contains("fa-arrow-right")) {
      this.direction = "to right";
      LocalStorage.set("direction", "to right");
    }
    this.applyGradient();
  }

  applyColor() {
    this.body.style.setProperty("--primary-color", this.color);
  }

  applyGradient() {
    if (!this.uploadedImage) {
      let style;
      if (this.orienation) {
        style = `linear-gradient(${this.direction}, var(--primary-color), #d3d3d3)`;
      } else {
        style = this.toggleGradient.checked
          ? "linear-gradient(to right, var(--primary-color), #d3d3d3)"
          : "var(--primary-color)";
      }
      this.body.style.background = style;
    }
  }

  applyLines() {
    let items = document.querySelectorAll("li");
    if (this.toggleLines.checked) {
      items.forEach(
        (item) => (item.style.borderBottom = "solid 1px var(--primary-color)")
      );
    } else {
      items.forEach((item) => (item.style.borderBottom = "none"));
    }
  }
}

export default Settings;
