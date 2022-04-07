const html = document.getElementsByTagName("html")[0];
html.setAttribute("style", "margin: 0; padding: 0; height: 100%; color: pink;");

const body = document.getElementsByTagName("body")[0];
body.setAttribute("style", "margin: 0; padding: 0; height: 100%; color: pink;");

const container = document.createElement("div");
container.setAttribute(
  "style",
  "margin: 0; height: 100%; display: flex; background: pink; justify-content: center; flex-direction: column; flex: 1; align-items: center;"
);

body.appendChild(container);

const calculator = document.createElement("div");
calculator.setAttribute(
  "style",
  "display: flex; flex-wrap: wrap-reverse; border: 1px black solid; border-radius: 25px; max-width: 350px; min-width: 350px; min-height: 500px; flex-wrap: wrap; background: gray; justify-content: center; align-items: center;"
);
container.appendChild(calculator);

/*please be pretty*/

const screen = document.createElement("div");
screen.classList.add("screen");
screen.setAttribute(
  "style",
  "display: flex; border-radius: 10px; border: 1px black solid; font-size: 32px; background: lightgray; text-align: center; box-sizing: border-box; min-height: 114px; max-height: 114px; justify-content: center; color: black; margin: 20px; padding: 20px; max-width: 310px; min-width: 310px;"
);
screen.innerText = "";
calculator.appendChild(screen);

let userInput = [];
let currentOp = [];
let opCounter = 0;
let checkForEnter = false;

let operators = {
  "+": {
    symbol: "+",
    position: 0,
    function: function add(a, b) {
      let result = a + b;
      ///*updateScreen();* /
      addResultToArgsArray(result);
      return result;
    },
  },

  "-": {
    symbol: "-",
    position: 1,
    function: function subtract(a, b) {
      let result = a - b;
      console.log(result);
      /*updateScreen();*/
      addResultToArgsArray(result);
      return result;
    },
  },
  "/": {
    symbol: "/",
    position: 2,
    function: function divide(a, b) {
      let result = a / b;
      console.log(result);
      /*updateScreen();*/
      addResultToArgsArray(result);
      return result;
    },
  },
  "*": {
    symbol: "*",
    position: 3,
    function: function multiply(a, b) {
      let result = a * b;
      console.log(currentOp);
      console.log(result);
      /*updateScreen();*/
      addResultToArgsArray(result);
      return result;
    },
  },
};

createButtons();

let opEntered = false;
let numEntered = false;

function updateScreen() {
  /*index = currentOp[0];*/

  errorCheck(result);
  console.log("result before Numer is " + result);

  result = Number(result);
  console.log("result after Number is " + result);

  console.log("checkforEnter is " + checkForEnter);
  console.log(Number.isFinite(result));

  /*if (userInput[1] == "0") {
        let string = userInput[0] + userInput[1];
        console.log("result is" + Number(string));
        userInput.push(Number(string));
        clearArgsArray();
    }

    else*/ if ((checkForEnter == true) & Number.isFinite(result)) {
    console.log("checkForEnter is true and result isFinite");
    screen.innerText += " = " + result;
    checkForEnter = false;
  } else if ((lastOp != "") & (opEntered == false)) {
    screen.innerText += " " + lastOp;
    lastOp = "";
    opEntered = true;
    numEntered = false;
  } else if (lastNum != undefined) {
    if (opEntered == false) {
      screen.innerText += lastNum;
    }

    if (opEntered == true) {
      screen.innerText += " " + lastNum;
    }

    lastNum = 0;
    numEntered = true;
    opEntered = false;
  } else errorMsg("Oops! Clear and try again.");
}

let lastNum = 0;
let lastOp = "";

function createButtons() {
  const operator = document.createElement("operator");

  // operators = {
  //  "+": operator[0],
  //}
  for (const [key, value] of Object.entries(operators)) {
    //for (let j = 0; j < operators.length; j++) {
    const button = document.createElement("button");
    button.setAttribute(
      "style",
      "background-color: #778899; margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;"
    );
    calculator.appendChild(button);
    button.innerText = key;

    button.onclick = function () {
      lastOp = key;
      currentOp.push(key);

      if (userInput.length != 2) {
      }
      if (userInput[1] != undefined) {
        if (userInput[1] != "0") {
          const a = parseFloat(userInput[0]);
          const b = parseFloat(userInput[1]);
          let result = value.function(a, b);
          console.log("result is " + result);
          updateScreen();
          addResultToArgsArray(result);
        }

        updateScreen();
      } else updateScreen();
    };
    console.log(operator);
  }

  for (let i = 9; i > -1; i--) {
    const button = document.createElement("button");
    button.setAttribute(
      "style",
      "margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;"
    );
    calculator.appendChild(button);
    button.innerText = i;

    button.onclick = function () {
      addArgsToArray(button.innerText);
      lastNum = button.innerText;
      errorCheck(lastNum);
      updateScreen();
      console.log(userInput);
    };
  }

  const enterClearContainer = document.createElement("div");
  calculator.appendChild(enterClearContainer);

  createEnterBtn();
  createClearBtn();

  function createEnterBtn() {
    const enter = document.createElement("button");
    enter.innerText = "Enter";
    enter.setAttribute(
      "style",
      "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;"
    );
    enterClearContainer.appendChild(enter);
    enter.onclick = function () {
      if (error == false) {
        if (currentOp.length > 0) {
          if (currentOp.length == 1) {
            // operators = {"+": operators[1]}
            // operators["+"] // <-- this will give you operators[1]
            // Old value: operators[currentOp[0]].function()
            const a = parseFloat(userInput[0]);
            const b = parseFloat(userInput[1]);
            let result = operators[currentOp[0]].function(a, b);

            if (result.toString().split(".")[1]) {
              result = result.toFixed(2);
            }
          } else if (currentOp.length > 1) {
            let index = currentOp.length - 1;

            //result = operators[currentOp[index]].function();
            const a = parseFloat(userInput[0]);
            const b = parseFloat(userInput[1]);
            result = operators[currentOp[index]].function(a, b);

            if (result.toString().split(".")[1]) {
              result = result.toFixed(2);
            }
          }

          clearArgsArray();
          checkForEnter = true;
          updateScreen();

          return;
        } else {
          let message = "Error! Clear and use an operator first.";
          errorMsg(message);
          return;
        }
      }
    };
  }

  function createClearBtn() {
    const clear = document.createElement("button");
    enterClearContainer.appendChild(clear);
    clear.innerText = "Clear";
    clear.setAttribute(
      "style",
      "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;"
    );
    clear.onclick = function clearScreen() {
      clearArgsArray();
      clearOpsArray();
      error = false;
      checkForEnter = false;
      numEntered = false;
      opEntered = false;
      screen.innerText = "";
    };
  }
}

function writeEquation(newArg, newOp, currentEquation) {
  let newEquation = [];
  if (!currentEquation[0]) {
    return equation.push(newArg);
  } else if (!currentOperator) {
    argsInput.push(newArg);
    let sumOfArgs = 0;
    for (let i = 0; i < argsInput.length; i++) {
      sumOfArgs += argsInput[i] * 10;
    }
    clearArgsArray();
    return argsInput.push(sumOfArgs);
  }
}

function addOpsToArray() {}
let argCounter = 0;

function addResultToArgsArray(result) {
  if (opCounter == 0) {
    opCounter += 1;
    console.log("opCounter+=1");
    return;
  } else {
    if (userInput[1] != 0) {
      opCounter += 1;
      clearArgsArray();
      userInput.push(result);
      console.log("result is" + result);
    } else return;

    /* else {
            opCounter +=1;
            let string = userInput[0] + userInput[1];
            console.log("result is" + Number(string));
            userInput.push(Number(string));
            clearArgsArray();
        }*/
  }
}

function clearArgsArray() {
  while (userInput.length > 0) {
    userInput.pop();
  }
}

function clearOpsArray() {
  while (currentOp.length > 0) {
    currentOp.pop();
  }
}

let error = false;

function errorCheck(num) {
  if (!Number.isFinite(num)) {
    errorMsg("Error! Please clear and try again.");
  } else return;
}

function errorMsg(string) {
  screen.innerText = "Error!";
  window.alert(string);
  error = true;
  clearArgsArray();
  clearOpsArray();
  return;
}

/*

Enter needs to be its own function

I can access functions in my array from the Enter button, but I do need to be able to call them from the string value in the currentOp array

I need to find the correct object in the array by index (or key) the call the value (AKA the function) when enter is pressed

So, my onclick buttons should add a value to currentOp, not actually cause the function to run

Only when I hit enter should the function actually run

*/

function test() {
  const el = document.createElement("pre");
  el.style.color = "black";
  document.body.appendChild(el);
  function log(text) {
    el.innerText += `\n${text}`;
  }

  function assert(assertion, message) {
    if (!assertion) {
      log(message);
    }
  }

  function assertEqual(a, b, message) {
    assert(a == b, a + " != " + b + ": " + message);
  }

  assert(1 + 1 == 2, "Math is wrong");

  assert(operators["+"], "addition should exist");
  assert(operators["-"], "subtraction should exist");
  assert(operators["/"], "division should exist");
  assert(operators["*"], "multiplication should exist");

  assertEqual(operators["+"].function(4, 3), 7, "addition should work");
  assertEqual(operators["*"].function(4, 3), 12, "multiplication should work");
  assertEqual(operators["-"].function(4, 3), 1, "subtraction should work");
  assertEqual(operators["/"].function(12, 3), 4, "division should work");
}

function main() {
  // This is where your program begins.
  test();
}
main();
