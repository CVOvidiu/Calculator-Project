"use strict";

const outputElem = document.querySelector(".calc__output");
const historyElem = document.querySelector(".calc__history");
const calcBtns = document.querySelector(".calc__btns");

class App {
  #output = "0";
  #term;
  #term2;
  #operator;

  constructor() {
    calcBtns.addEventListener("click", this.#state.bind(this));
  }

  #state(e) {
    // Event delegation
    if (e.target.classList.contains("calc__btns")) return;

    // If a button was pressed when Error
    if (this.#output === "Error") {
      this.#output = "0";
      outputElem.innerHTML = this.#output;
      return;
    }

    // Button pressed
    const pressed = e.target.innerHTML;

    // Number button
    if (e.target.classList.contains("btn--num"))
      this.#output = this.#numBtnHandler(pressed);

    switch (e.target.innerHTML) {
      case "del":
        this.#output = this.#delBtnHandler();
        break;

      case "C":
        this.#reset();
        break;

      case "=":
        this.#output = this.#equalBtnHandler();
        break;

      case ".":
        this.#output = this.#dotBtnHandler();
        break;

      case "+":
        this.#output = this.#operationBtnHandler("+");
        break;

      case "-":
        this.#output = this.#operationBtnHandler("-");
        break;

      case "/":
        this.#output = this.#operationBtnHandler("/");
        break;

      case "*":
        this.#output = this.#operationBtnHandler("*");
        break;

      case "sqrt":
        this.#output = this.#sqrtBtnHandler();
        break;

      case "%":
        this.#output = this.#percentBtnHandler();
        break;

      default:
        break;
    }

    // If operation threw an error or not
    if (this.#output === "Error") outputElem.innerHTML = this.#output;
    else outputElem.innerHTML = this.#formatComma(this.#output);

    console.log(
      e.target,
      pressed,
      this.#output,
      this.#term,
      this.#term2,
      this.#operator
    ); //! Debugging purposes
  }

  #numBtnHandler(pressed) {
    //* When history has '=' reset everything
    if (historyElem.innerHTML.slice(-1) === "=") this.#reset();

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
    //* When history has '=' reset everything
    if (historyElem.innerHTML.slice(-1) === "=") this.#reset();

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

  #operationBtnHandler(op) {
    let output = this.#output;

    //* No first term
    if (this.#term === undefined) {
      this.#term = Number(output);
    } else {
      //* First term is defined
      if (this.#term2 === undefined) {
        //* Second term is not defined
        if(output !== '0') //* Only change the operator if is '0'
          this.#term = this.#floatify(eval(`${this.#term} ${op} ${Number(output)}`)); //prettier-ignore
      } else {
        //* Second term is defined
        this.#term2 = undefined;
        this.#term = Number(output);
      }
    }

    this.#operator = op;

    //* Before outputting the result, we check if term value is past limit
    if (String(this.#term).length > 15) {
      output = this.#error();
    } else {
      //* Not error
      historyElem.innerHTML = String(this.#term) + ` ${op}`;
      output = "0";
    }

    //* Reset 'output' font-size
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
          output = String(this.#floatify(eval(`${this.#term} ${this.#operator} ${this.#term2}`))); //prettier-ignore
        } else {
          //* Second term defined
          this.#term = Number(output);
          historyElem.innerHTML = `${this.#term} ${this.#operator} ${this.#term2} =`; //prettier-ignore
          output = String(this.#floatify(eval(`${this.#term} ${this.#operator} ${this.#term2}`))); //prettier-ignore
        }
      }
    }

    //* No support for scientific notation
    if (output.length > 15) {
      output = this.#error();
    }

    //* Font transformation
    if (output.length > 10)
      outputElem.style.fontSize = `${50 + 3.5 * (10 - output.length)}px`;
    else outputElem.style.fontSize = `50px`;

    return output;
  }

  #sqrtBtnHandler() {
    let output = this.#output;

    if (this.#term2 === undefined) {
      this.#term = this.#floatify(Math.sqrt(Number(output)));
      historyElem.innerHTML = `sqrt(${output})`;
      return (output = String(this.#term));
    } else {
      this.#term2 = this.#floatify(Math.sqrt(Number(output)));
      historyElem.innerHTML = `${this.#term} ${this.#operator} sqrt(${this.#term2})`; //prettier-ignore
      return (output = String(this.#term2));
    }
  }

  #percentBtnHandler() {
    let output = this.#output;

    if (this.#operator === undefined) {
      historyElem.innerHTML = "0";
      return (output = "0");
    } else {
      this.#term2 = this.#floatify(this.#term * (Number(output) / 100));
      output = String(this.#term2);
      historyElem.innerHTML = `${this.#term} ${this.#operator} ${this.#term2}`; //prettier-ignore
      return output;
    }
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

  #error() {
    this.#term = undefined;
    this.#term2 = undefined;
    this.#operator = undefined;
    historyElem.innerHTML = "";
    return "Error";
  }

  #reset() {
    this.#term = undefined;
    this.#term2 = undefined;
    this.#operator = undefined;
    this.#output = "0";
    historyElem.innerHTML = "";
    outputElem.innerHTML = "0";
  }

  #floatify(number) {
    // Avoid division by 0
    if (number === Infinity) return this.#error();
    else return parseFloat(number.toFixed(10));
  }
}

const instance = new App();
