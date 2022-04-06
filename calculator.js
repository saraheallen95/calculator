//

function test(operators) {
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

  /*assertEqual(roundResult(1.1112), 1.12, "should round to 1.12");
  assertEqual(roundResult(10), 10, "should not round");*/

  assertEqual(operators["+"].function(4, 3), 7, "addition should work");
  assertEqual(operators["*"].function(4, 3), 12, "multiplication should work");
  assertEqual(operators["-"].function(4, 3), 1, "subtraction should work");
  assertEqual(operators["/"].function(12, 3), 4, "division should work");
}

function main() {
  // This is where your program begins.

  const html = document.getElementsByTagName("html")[0];
  html.setAttribute(
    "style",
    "margin: 0; padding: 0; height: 100%; color: pink;"
  );

  const body = document.getElementsByTagName("body")[0];
  body.setAttribute(
    "style",
    "margin: 0; padding: 0; height: 100%; color: pink;"
  );

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

  const screen = document.createElement("div");
  screen.classList.add("screen");
  screen.setAttribute(
    "style",
    "display: flex; border-radius: 10px; border: 1px black solid; font-size: 32px; background: lightgray; text-align: center; box-sizing: border-box; min-height: 114px; max-height: 114px; justify-content: center; color: black; margin: 20px; padding: 20px; max-width: 310px; min-width: 310px;"
  );
  screen.innerText = "";
  calculator.appendChild(screen);

  const enterClearContainer = document.createElement("div");
  calculator.appendChild(enterClearContainer);
  enterClearContainer.appendChild(createEnterBtn());
  enterClearContainer.appendChild(createClearBtn());

  const operators = createOperatorsDictionary();

  let eq = { a: null, b: null, op: null };
  console.log(eq);
  createOperators(operators);
  createNumberKeys();

  createEnterBtn();
  createClearBtn();
  test(operators);

  function createOperatorsDictionary() {
    let operators = {
      "+": {
        symbol: "+",
        position: 0,
        function: function add(a, b) {
          let result = a + b;
          return result;
        },
      },

      "-": {
        symbol: "-",
        position: 1,
        function: function subtract(a, b) {
          let result = a - b;
          return result;
        },
      },
      "/": {
        symbol: "/",
        position: 2,
        function: function divide(a, b) {
          let result = a / b;
          return result;
        },
      },
      "*": {
        symbol: "*",
        position: 3,
        function: function multiply(a, b) {
          let result = a * b;
          return result;
        },
      },
    };
    return operators;
  }

  function createOperators(operators) {
    const operator = document.createElement("operator");

    for (const [key, value] of Object.entries(operators)) {
      //for (let j = 0; j < operators.length; j++) {
      const button = document.createElement("button");
      button.setAttribute(
        "style",
        "background-color: #778899; margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;"
      );
      calculator.appendChild(button);
      button.innerText = key;
      let input = "";
      let result = "";
      button.onclick = function () {
        console.log(eq);
        let enterCheck = false;
        if (!eq.a) {
          //if an operator has been entered without any args, throws an error
          input = undefined;
        } else if (eq.op == null) {
          //if no operator has been entered yet, pushes operator to eq.
          eq.op = key;
          input = " " + key;
        } else if (!eq.b) {
          //if operator exists but only one argument has been entered, throws an error.
          input = undefined;
        } else {
          //if eq.a, eq.b, and eq.op exist, caculates the result, clears eq's properties, and pushes the result to eq.a.
          input = " " + key + " ";
          let result = calculateResult(eq);
          resetEquation(eq);
          eq.op = key;
          eq.a = result;
        }
        updateScreen(enterCheck, input, screen);
      };
    }
  }

  function addOpsToEquation(eq, key) {
    if (!eq.a) {
      //if an operator has been entered without any args, throws an error
      input = undefined;
    } else if (eq.op == null) {
      //if no operator has been entered yet, pushes operator to eq.
      eq.op = key;
      input = " " + key;
    } else if (!eq.b) {
      //if operator exists but only one argument has been entered, throws an error.
      input = undefined;
    } else {
      //if eq.a, eq.b, and eq.op exist, caculates the result, clears eq's properties, and pushes the result to eq.a.
      input = " " + key + " ";
      let result = calculateResult(eq);
      resetEquation(eq);
      eq.op = key;
      eq.a = result;
    }
    return eq;
  }
  function createNumberKeys() {
    for (let i = 9; i > -1; i--) {
      const button = document.createElement("button");
      button.setAttribute(
        "style",
        "margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;"
      );
      calculator.appendChild(button);
      button.innerText = i;

      button.onclick = function () {
        let enterCheck = false;
        eq = addArgsToEquation(eq, i);
        updateScreen(enterCheck, i, screen);
      };
    }
  }

  function updateScreen(enterCheck, input, screen) {
    let string = screen.innerText;
    let lastChar = 0;

    //finds last character entered by user.
    if (string.length > 1) {
      let index = string.length - 1;
      lastChar = string[index];
    }

    if (input == undefined) {
      //if input is bad, throws an error
      screen.innerText = "Error! Clear and try again.";
      return;
    } else if (string.includes("=")) {
      //if enter has already been pressed, throws an error
      screen.innerText = "Error! Clear and try again.";
      return;
    } else if (enterCheck == true) {
      //if enter has been pressed, adds an equals sign and the result (called input)
      screen.innerText += " = " + input;
    } else if (isNaN(lastChar)) {
      //if the last char entered is an operator, adds a space after the operator.
      screen.innerText += " " + input;
    } else {
      //if the last char entered is a number, adds number without a space in between.
      screen.innerText += input;
    }

    return;
  }

  function addArgsToEquation(eq, i) {
    if (eq.a == null) {
      eq.a = i;
    } else if (eq.op == null) {
      eq.a = eq.a * 10 + i;
    } else if (eq.b == null) {
      eq.b = i;
    } else {
      eq.b = eq.b * 10 + i;
    }
    return eq;
  }

  function calculateResult(eq) {
    let result = 0;

    if (eq.op) {
      {
        result = operators[eq.op].function(parseFloat(eq.a), parseFloat(eq.b));
        if (Number.isFinite(result)) {
          console.log("result is finite");
          return roundResult(result);
        } else {
          return undefined;
        }
      }
    } else {
      return undefined;
    }
  }
  function resetEquation(eq) {
    eq.a = null;
    eq.b = null;
    eq.op = null;
    return eq;
  }

  function createEnterBtn() {
    const enterBtn = document.createElement("button");
    enterBtn.innerText = "Enter";
    enterBtn.setAttribute(
      "style",
      "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;"
    );
    enterBtn.onclick = function () {
      let enterCheck = true;
      updateScreen(enterCheck, calculateResult(eq), screen);
      resetEquation(eq);
    };
    return enterBtn;
  }

  function roundResult(result) {
    if (result.toString().split(".")[1]) {
      return result.toFixed(2);
    } else {
      return result;
    }
  }

  function createClearBtn(enterClearContainer) {
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.setAttribute(
      "style",
      "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;"
    );
    clearBtn.onclick = function () {
      resetEquation(eq);
      screen.innerText = "";
    };
    return clearBtn;
  }
  function errorMsg(string) {
    window.alert(string);

    return;
  }
}
main();
