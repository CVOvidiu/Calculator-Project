"use strict";

const outputElem = document.querySelector(".calc__output");
const historyElem = document.querySelector(".calc__history");
const calcBtns = document.querySelector(".calc__btns");

class App {
  #output = "0";
  #term = undefined;
  #term2 = undefined;
  #operator;

  constructor() {
    calcBtns.addEventListener("click", this.#state.bind(this));
  }

  #state(e) {
    // Event delegation
    if (e.target.classList.contains("calc__btns")) return;

    // Button pressed
    const pressed = e.target.innerHTML;

    // Number button
    if (e.target.classList.contains("btn--num"))
      this.#output = this.#numBtnHandler(pressed);

    // Delete button
    if (e.target.innerHTML === "del") this.#output = this.#delBtnHandler();

    // Dot button
    if (e.target.innerHTML === ".") this.#output = this.#dotBtnHandler();

    // Plus button
    if (e.target.innerHTML === "+") this.#output = this.#plusBtnHandler();

    // Equal button
    if (e.target.innerHTML === "=") this.#output = this.#equalBtnHandler();

    if (this.#output === "Error") outputElem.innerHTML = this.#output;
    else outputElem.innerHTML = this.#formatComma(this.#output);
    console.log(e.target, pressed, this.#output); //! Debugging purposes
  }

  #numBtnHandler(pressed) {
    let output = this.#output;
    // Stop at 15 digits
    if (output.length === 15) return output;

    // Normal behavior
    if (output === "0") output = pressed;
    else output += `${pressed}`;

    // Font-size transformation
    if (output.length > 10)
      outputElem.style.fontSize = `${50 + 3.5 * (10 - output.length)}px`;

    return output;
  }

  #delBtnHandler() {
    let output = this.#output;
    // Normal behavior
    if (output.length === 1) output = "0";
    else output = output.slice(0, output.length - 1);

    // Font-size transformation
    if (output.length > 10)
      outputElem.style.fontSize = `${50 + 3.5 * (10 - output.length)}px`;

    return output;
  }

  #dotBtnHandler() {
    let output = this.#output;
    // Normal behavior
    if (!output.includes(".")) output += ".";

    return output;
  }

  #plusBtnHandler() {
    let output = this.#output;
    this.#operator = "+";
    // If 'output' is 'Error'
    if (output === "Error") return (output = "0");

    // Normal behavior
    if (!this.#term) this.#term = Number(output);
    else {
      // If equal button was pressed previously
      if (historyElem.innerHTML.slice(-1) === "=") {
        historyElem.innerHTML = historyElem.innerHTML.slice(0, historyElem.innerHTML.length - 1) + "+"; //prettier-ignore
        return "0";
      }
      this.#term += Number(output);
    }

    if (String(this.#term).length > 15) {
      // No support for scientific notation
      this.#term = 0;
      historyElem.innerHTML = "";
      output = "Error";
    } else {
      // Normal behavior
      historyElem.innerHTML = String(this.#term) + " +";
      output = "0";
    }
    // Reset 'output' font-size
    outputElem.style.fontSize = "50px";

    return output;
  }

  #equalBtnHandler() {
    let output = this.#output;

    //* No history
    if (this.#term === undefined) {
      this.#term = Number(output);
      historyElem.innerHTML = `${this.#term} =`;
    } else {
      //* First term defined
      if (this.#operator === undefined) {
        //* Operator undefined (=)
        this.#term = Number(output);
        historyElem.innerHTML = `${this.#term} =`;
      } else {
        //* Operator defined
        if (this.#term2 === undefined) {
          //* Second term undefined
          this.#term2 = Number(output);
          historyElem.innerHTML = `${this.#term} ${this.#operator} ${this.#term2} =`; //prettier-ignore
          output = String(eval(historyElem.innerHTML.slice(0, historyElem.innerHTML.length - 2))); //prettier-ignore
        } else {
          //* Second term defined
          this.#term = Number(output);
          historyElem.innerHTML = `${this.#term} ${this.#operator} ${this.#term2} =`; //prettier-ignore
          output = String(eval(historyElem.innerHTML.slice(0, historyElem.innerHTML.length - 2))); //prettier-ignore
        }
      }
    }

    return output;
  }

  #formatComma(num) {
    // Split the number into integer part and decimal part
    let [intNumber, decNumber] = num.split(".");
    intNumber = Number(intNumber);
    // Take the last three digits from 'intNumber'
    let format = String(intNumber).slice(-3);
    intNumber = Math.trunc(intNumber / 1000);

    // What remains of 'intNumber' but still can be formated
    while (intNumber > 999) {
      format = `${String(intNumber).slice(-3)},${format}`;
      intNumber = Math.trunc(intNumber / 1000);
    }

    // What remains of 'intNumber'
    if (intNumber) format = `${String(intNumber).slice(-3)},${format}`;

    if (decNumber === "") return `${format}.`; // If dot button was pressed
    else if (decNumber === undefined) return format;
    else return `${format}.${decNumber}`;
  }
}

const instance = new App();
