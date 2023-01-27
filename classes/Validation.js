import ToDoList from "./ToDoList.js";

class Validation {
  static isValidLength(input) {
    const isGreaterThanZero = input.length > 0;
    const isLessThanMax = input.length < ToDoList.maxLength;
    return isGreaterThanZero && isLessThanMax;
  }
}

export default Validation;
