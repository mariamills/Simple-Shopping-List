const body = document.querySelector("body");
const addBtn = document.querySelector(".addBtn");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

//Max length that the user's input can be
let maxLength = 25;

//Event listener for add button
addBtn.addEventListener("click", function () {
  if (isValidLength(input.value)) {
    addToList();
  } else {
    input.classList.add("error");
    alert(
      "Please make sure your item is greater than 0 characters & less than 25 characters."
    );
  }
});

//Event listener for Enter key pressed
input.addEventListener("keyup", function (e) {
  if (e.code === "Enter") {
    if (isValidLength(input.value)) {
      addToList();
    } else {
      input.classList.add("error");
      alert(
        "Please make sure your item is greater than 0 characters & less than 25 characters."
      );
    }
  }
});

//Function declaration for checking input value length
function isValidLength(input) {
  const isGreaterThanZero = input.length > 0;
  const isLessThanMax = input.length < maxLength;
  return isGreaterThanZero && isLessThanMax;
}

//Function declaration for adding an item to the list
function addToList() {
  let div = document.createElement("div");
  let li = document.createElement("li");
  let i1 = document.createElement("i");
  let i2 = document.createElement("i");

  i1.classList.add("fa-solid", "fa-pencil");
  i2.classList.add("fa-solid", "fa-trash");
  li.innerText = input.value;

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
