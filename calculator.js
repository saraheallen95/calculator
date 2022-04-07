//

const operators = {
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
function test(keys, screen) {
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

  // Table driven test.
  const tests = [
    [2, 5, "*", 10],
    [3, 4, "+", 7],
    [10, 8, "-", 2],
    [80, 4, "/", 20],
  ];

  for (const [a, b, op, want] of tests) {
    const eq = new Equation(a, b, op);
    const got = eq.calculateResult();
    assertEqual(
      got,
      want,
      `${a} ${op} ${b} should equal ${want} but was ${got}`
    );
  }

  function assertScreen(want) {
    let got = screen.innerText;
    assertEqual(want, got, "Screen should match");
  }

  const keyTests = [
    ["1", ["1"]],
    ["1 + 4 = 5", ["1", "+", "4", "="]],
    ["100 / 2 = 50", ["1", "0", "0", "/", "2", "="]],
  ];
  for (const [want, keysToPress] of keyTests) {
    keys["Clear"]();
    for (const keyToPress of keysToPress) {
      keys[keyToPress]();
    }
    assertScreen(want);
    keys["Clear"]();
  }
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
    "margin: 0; padding: 0; height: 100%; display: flex; background: pink; justify-content: center; flex-direction: column; flex: 1; align-items: center;"
  );
  body.appendChild(container);

  const calculator = document.createElement("div");
  calculator.setAttribute(
    "style",
    "display: flex; overflow: hidden; border: 1px black solid; border-radius: 25px; padding: 35px; min-height: 66%; max-height: 80%; min-width: 468px; max-width: 33%; flex-wrap: wrap; background: gray; justify-content: center; align-items: center;"
    //max-width: 400px; min-width: 400px;  min-height: 600px;
  );
  container.appendChild(calculator);

  const screen = document.createElement("div");
  screen.classList.add("screen");
  screen.setAttribute(
    "style",
    "display: flex; padding: 20px; overflow: hidden; border-radius: 10px; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-all; word-break: break-word; hyphens: auto; border: 1px black solid; font-size: 32px; background: lightgray; text-align: center; box-sizing: border-box; justify-content: center; color: black; margin: 10px; max-height: 30%; min-height: 30%; min-width: 100%; max-width: 100%;"
  );
  screen.innerText = "";
  calculator.appendChild(screen);
  const keys = {};

  const eq = new Equation();

  const keypad = document.createElement("div");
  keypad.setAttribute(
    "style",
    "display: flex; flex-direction: row; flex-wrap: wrap; max-width: 100%; margin-top: 5px; margin-bottom: 20px; max-height: 50%;"
  );
  calculator.appendChild(keypad);

  const numberKeyColumn = document.createElement("div");
  numberKeyColumn.setAttribute(
    "style",
    "max-width: 75%;"
    //flex-direction: column
  );
  keypad.appendChild(numberKeyColumn);

  const operatorKeyColumn = document.createElement("div");
  operatorKeyColumn.setAttribute(
    "style",
    "display: flex; flex: 25%; min-width: 25%; flex-direction: column;"
    //
  );
  keypad.appendChild(operatorKeyColumn);

  const operatorKeys = createOperatorKeys(keys, eq, screen);
  for (const operatorKey of operatorKeys) {
    operatorKey.style.minHeight = "20%";
    operatorKey.style.maxHeight = "20%";
    operatorKey.style.minWidth = "75%";
    operatorKey.style.maxWidth = "75%";

    operatorKeyColumn.appendChild(operatorKey);
  }
  const numberKeys = createNumberKeys(keys, eq, screen);
  for (const numberKey of numberKeys) {
    numberKeyColumn.appendChild(numberKey);
  }

  numberKeyColumn.appendChild(
    createFatKey(keys, "0", function () {
      let enterCheck = false;
      eq.addArgsToEquation(0);
      updateScreen(enterCheck, 0, screen);
    })
  );

  const backspaceKey = createSkinnyKey("Dlt", "#778899", function () {
    let enterCheck = false;
    let string = screen.innerText;
    console.log(string);
    eq.backspace(string);
    let backspace = "backspace";
    updateScreen(enterCheck, backspace, screen);
  });
  numberKeyColumn.appendChild(backspaceKey);

  const enterKey = createFatKey(keys, "=", function () {
    let enterCheck = true;
    updateScreen(enterCheck, eq.calculateResult(), screen);
    eq.resetEquation();
  });
  enterKey.style.backgroundColor = "#778899";
  numberKeyColumn.appendChild(enterKey);

  const clearKey = createFatKey(keys, "Clear", function () {
    eq.resetEquation();
    screen.innerText = "";
  });
  clearKey.style.minWidth = "75%";
  clearKey.style.maxHeight = "20%";
  clearKey.style.minHeight = "10%";
  clearKey.style.margin = "30px 30px 30px";
  calculator.appendChild(clearKey);

  test(keys, screen);
}

function createSkinnyKey(name, color, callback) {
  const button = document.createElement("button");
  button.setAttribute(
    "style",
    "margin: 10px; border-radius: 10px; font-size: 24px; min-width: 25%; min-height: 20%; max-height: 20%; max-width: 25%;"
  );
  //
  button.style.backgroundColor = color;
  button.innerText = name;
  button.onclick = callback;
  return button;
}

function createFatKey(keys, name, callback) {
  const key = document.createElement("button");
  key.innerText = name;
  //m
  /* key.setAttribute(
    "style",
    "display: flex; justify-content: center; align-content: center; align-items: center; align-text: center; margin: 25px; border-radius: 10px; font-size: 32px; in-height: 50%; min-width: 33%;  min-height: 100%;"
  );*/
  key.setAttribute(
    "style",
    "margin: 10px; border-radius: 10px; font-size: 24px; min-width: 25%; min-height: 20%; max-height: 20%; max-width: 25%;"
  );
  key.onclick = callback;
  keys[name] = callback;
  return key;
}
function createOperatorKeys(keys, eq, screen) {
  const buttons = [];
  for (const [key, _operator] of Object.entries(operators)) {
    const callback = function () {
      let enterCheck = false;
      let input = eq.addOpsToEquation(key);
      updateScreen(enterCheck, input, screen);
    };
    const button = createSkinnyKey(key, "#778899", callback);
    keys[key] = callback;
    buttons.push(button);
  }
  return buttons;
}
function createNumberKeys(keys, eq, screen) {
  const buttons = [];

  for (let i = 9; i > 0; i--) {
    const callback = function () {
      let enterCheck = false;
      eq.addArgsToEquation(i);
      updateScreen(enterCheck, i, screen);
    };
    const button = createSkinnyKey(i, "rgb(239, 239, 239)", callback);
    keys[i] = callback;
    buttons.push(button);
  }
  return buttons;
}
class Equation {
  constructor(a, b, op) {
    this.a = a;
    this.b = b;
    this.op = op;
  }
  addOpsToEquation(key) {
    let input;
    if (!this.a) {
      //if an operator has been entered without any args, throws an error
      input = undefined;
    } else if (this.op == null) {
      //if no operator has been entered yet, pushes operator to eq.
      this.op = key;
      input = " " + key;
    } else if (!this.b) {
      //if operator exists but only one argument has been entered, throws an error.
      input = undefined;
    } else {
      //if eq.a, eq.b, and eq.op exist, caculates the result, clears eq's properties, and pushes the result to eq.a.
      input = " " + key + " ";
      let result = this.calculateResult();
      this.resetEquation();
      this.op = key;
      this.a = result;
    }
    return input;
  }

  calculateResult() {
    let result = 0;

    if (this.op) {
      {
        result = operators[this.op].function(
          parseFloat(this.a),
          parseFloat(this.b)
        );
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
  addArgsToEquation(i) {
    if (this.a == null) {
      this.a = i;
    } else if (this.op == null) {
      this.a = this.a * 10 + i;
    } else if (this.b == null) {
      this.b = i;
    } else {
      this.b = this.b * 10 + i;
    }
  }
  resetEquation() {
    this.a = null;
    this.b = null;
    this.op = null;
  }
  backspace(string) {
    if (string.length > 1) {
      let index = string.length - 1;
      console.log(string[index]);
      let lastChar = string[index];
      if (lastChar == this.a) {
        this.a = null;
      } else if (lastChar == this.b) {
        this.b = null;
      } else if (lastChar == this.op) {
        this.op = null;
      }
    }
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

  if (string.includes("=") || string.includes("Error")) {
    //if enter has already been pressed, throws an error
    screen.innerText = "Error! Clear and try again.";
  } else if (input == undefined) {
    //if input is bad, throws an error
    screen.innerText = "Error! Clear and try again.";
  } else if (input == "backspace") {
    screen.innerText = string.substr(0, string.length - 1);
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
}

function roundResult(result) {
  if (result.toString().split(".")[1]) {
    return result.toFixed(2);
  } else {
    return result;
  }
}

main();
