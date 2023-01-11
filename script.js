const body = document.querySelector("body");
const addBtn = document.querySelector(".addBtn");
const input = document.querySelector("input[type='text']");
const ul = document.querySelector("ul");
const settings = document.getElementById("settings");
const sidebar = document.querySelector(".sidebar");
const colorInput = document.querySelector("input[type='color']");
const toggleGradient = document.getElementById("toggleGradient");
const toggleLines = document.getElementById("toggleLines");
const toggleBtn = document.getElementById("toggleBtn");
const clear = document.getElementById("clear");

const title = document.getElementById("title");

let items = [];
let gradientMode = true;

//Item limit due to using LocalStorage since LocalStorage has a storage limit of about 5 to 10 megabytes depending on the browser and device
const itemLimit = 50;
//Max length that the user's input can be
const maxLength = 25;

// Function for handling when the 'ADD' button / Enter key is pressed to reduce code duplication
function handleAddBtnClick() {
  if (!isValidLength(input.value)) {
    input.classList.add("error");
    alert(
      "Please make sure your item is greater than 0 characters & less than 25 characters."
    );
  } else if (items.length < maxLength) {
    items.push(input.value);
    localStorage.setItem("items", JSON.stringify(items));
    addToList(input.value);
    input.value = "";
  } else {
    input.classList.add("error");
    alert("You've reached the item limit.");
  }
}

//Function declaration for checking input value length
function isValidLength(input) {
  const isGreaterThanZero = input.length > 0;
  const isLessThanMax = input.length < maxLength;
  return isGreaterThanZero && isLessThanMax;
}

//Event listener for add button
addBtn.addEventListener("click", handleAddBtnClick);

//Event listener for Enter key pressed
input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    handleAddBtnClick();
  }
});

//Function declaration for adding an item to the list
function addToList() {
  let div = document.createElement("div");
  let li = document.createElement("li");
  let i1 = document.createElement("i");
  let i2 = document.createElement("i");

  i1.classList.add("fa-solid", "fa-pencil");
  i2.classList.add("fa-solid", "fa-trash");
  li.innerText = input.value;

  if (!toggleLines.checked) {
    li.style.borderBottom = "none";
  }

  ul.appendChild(li);
  div.appendChild(i1);
  div.appendChild(i2);
  li.appendChild(div);
  input.value = "";
}

//Had to make use of event delegation since elements are created dynamically
//Item cross-off functionality
ul.addEventListener("click", function (e) {
  const target = e.target;

  if (target.matches("li:not(i)")) {
    target.classList.toggle("done");
  }
});

//Delete functionality
ul.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-trash")) {
    let deletedValue = e.target.parentElement.parentElement.textContent;
    let deletedIndex = items.indexOf(deletedValue);
    items.splice(deletedIndex, 1);
    localStorage.setItem("items", JSON.stringify(items));
    e.target.parentElement.parentElement.remove();
  }
});

//Edit functionality
ul.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-pencil")) {
    let parent = e.target.parentNode.parentNode; // Get the parent li element
    let newInput = document.createElement("input");

    // Replace the li element with the input element
    parent.replaceChild(newInput, parent.firstChild);

    newInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        let newText = document.createTextNode(newInput.value);
        if (isValidLength(newText)) {
          parent.replaceChild(newText, newInput);
        } else {
          newInput.classList.add("error");
          alert(
            "Please make sure your item is greater than 0 characters & less than 25 characters."
          );
        }
      }
    });

    newInput.focus();
  }
});

//Settings
settings.addEventListener("click", () => sidebar.classList.toggle("toggle"));

//Color changer
colorInput.addEventListener("input", function () {
  // Store the color in local storage
  localStorage.setItem("color", colorInput.value);

  // Get the color from local storage
  let color = localStorage.getItem("color");

  // Set the --primary-color variable on the :root element
  document.querySelector(":root").style.setProperty("--primary-color", color);

  if (gradientMode) {
    body.style.backgroundImage = `linear-gradient(to right, ${colorInput.value}, #d3d3d3)`;
  } else {
    body.style.background = colorInput.value;
  }
});

//Gradient Background Toggle
toggleGradient.addEventListener("click", function () {
  gradientMode = !gradientMode;
});

//Lines Toggle
toggleLines.addEventListener("click", function () {
  let lis = document.getElementsByTagName("li");
  for (let li of lis) {
    let targetStyle =
      li.style.borderBottom === "none"
        ? "solid 1px var(--primary-color)"
        : "none";
    li.style.borderBottom = targetStyle;
  }
});

//Button enabled/disable toggle
toggleBtn.addEventListener("click", function () {
  addBtn.classList.toggle("hidden");
});

//Clear button
clear.addEventListener("click", function () {
  ul.innerHTML = "";
  localStorage.clear();
});

// Window load
window.addEventListener("load", function () {
  if (typeof Storage !== "undefined") {
    let storedValue = localStorage.getItem("item");
    let storedColor = localStorage.getItem("color");
    if (storedColor) {
      document
        .querySelector(":root")
        .style.setProperty("--primary-color", storedColor);
      colorInput.value = storedColor;
    }
    if (storedValue) {
      addToList(storedValue);
    }
  }
});
