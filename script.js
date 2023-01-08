const body = document.querySelector("body");
const addBtn = document.querySelector(".addBtn");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

//Max length that the user's input can be
let maxLength = 15;

//Event listener for add button
addBtn.addEventListener("click", function () {
  if (checkLength()) {
    addToList();
  }
});

//Event listener for Enter key pressed
input.addEventListener("keypress", function (e) {
  if (checkLength() > 0 && e.code === "Enter") {
    addToList();
  }
});

//Function declaration for checking input value length
function checkLength() {
  return input.value.length > 0 && input.value.length < maxLength;
}

//Function declaration for adding an item to the list
function addToList() {
  let div = document.createElement("div");
  let li = document.createElement("li");
  let i = document.createElement("i");

  div.classList.add("list-item");
  i.classList.add("fa-solid", "fa-trash");
  li.innerText = input.value;
  div.appendChild(li);
  div.appendChild(i);
  ul.appendChild(div);
  input.value = "";
}

//Had to make use of event delegation since elements are created dynamically
//Item cross-off functionality
ul.addEventListener("click", function (e) {
  if (e.target.tagName.toLowerCase() === "li") {
    e.target.classList.toggle("done");
    console.log("Completed!");
  }
});

//Delete functionality
ul.addEventListener("click", function (e) {
  if (e.target.tagName.toLowerCase() === "i") {
    e.target.parentElement.remove();
    console.log("Removed");
  }
});
