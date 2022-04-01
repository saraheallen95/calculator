
const html = document.getElementsByTagName("html")[0];
html.setAttribute("style", "margin: 0; padding: 0; height: 100%; color: pink;");

const body = document.getElementsByTagName("body")[0];
body.setAttribute("style", "margin: 0; padding: 0; height: 100%; color: pink;");

const container = document.createElement('div');
container.setAttribute("style", "margin: 0; height: 100%; display: flex; background: pink; justify-content: center; flex-direction: column; flex: 1; align-items: center;")
body.appendChild(container);

const calculator = document.createElement('div');
calculator.setAttribute("style", "display: flex; border: 1px black solid; border-radius: 25px; max-width: 300px; min-width: 300px; min-height: 500px; flex-wrap: wrap; background: gray; justify-content: center; align-items: center;")
container.appendChild(calculator);

let result = "";

const screen = document.createElement('div');
screen.classList.add("screen");
screen.setAttribute("style", "display: flex; border-radius: 10px; border: 1px black solid; font-size: 48px; background: lightgray; text-align: center; box-sizing: border-box; min-height: 97px; justify-content: center; color: black; margin: 20px; padding: 20px; min-width: 250px;");
screen.innerText = "";
calculator.appendChild(screen);

let userInput = [];
let currentOp = [];

let checkForEnter = false;

let operators = [
    {"symbol": " + ",
    "function" : function add () {

        result = parseFloat(userInput[0]) + parseFloat(userInput[1]);
        updateScreen();

        return result;

    }},

    {"symbol" : " - ",
    "function" : function subtract () {

        result = parseFloat(userInput[0]) - parseFloat(userInput[1]);
        console.log(result);
        updateScreen();

        return result;
    
    }},
    {"symbol" : " / " ,
    "function" : 
    function divide () {

        result = userInput[0] / userInput[1];
        console.log(result);
        updateScreen();

        return result;
    
    }},
    {"symbol" : "*",
    "function" : function multiply () {
        result = userInput[0] * userInput[1];
        console.log(currentOp);
        console.log(result);
        updateScreen();

        return result;
    
    }}
]

createButtons();

function updateScreen () {

    errorCheck();

    if (error == false) {

        index = currentOp[0];

        if (checkForEnter == true) {
            screen.innerText += " = " + result;

        }

        else if (userInput[1] != undefined) {
            console.log('if statement 1');
            screen.innerText = userInput[0] + " " + operators[index].symbol + " " + userInput[1];
        }

        else if (currentOp[0] != undefined) {
            console.log('if statement 2');

            screen.innerText = userInput[0] + " " + operators[index].symbol;
        }
        else {
            console.log('if statement 3');

            screen.innerText = userInput[0];
        }
    }

    else return;
}

function createButtons () {


    for (let i = 0; i < 10; i++) {
    const button = document.createElement('button');
    button.setAttribute("style", "margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;")
    calculator.appendChild(button);
    button.innerText = i;

    button.onclick = function () {
        errorCheck();
        if (error == false) {
            addArgsToArray(button.innerText);
             updateScreen();
            console.log(userInput);
        }
    }

    }

   

    const operator = document.createElement('operator');

    for (let j = 0; j < operators.length; j++) {
            const button = document.createElement('button')
            button.setAttribute("style", "margin: 10px; border-radius: 10px; font-size: 24px; min-height: 50px; min-width: 75px;")
            calculator.appendChild(button);
            button.innerText = operators[j].symbol;
            button.onclick = function () {
            currentOp.push(j);
            updateScreen();

        }
        console.log(operator);
    }

    const enterClearContainer = document.createElement('div');
    calculator.appendChild(enterClearContainer);

    createEnterBtn();
    createClearBtn();

    function createEnterBtn() {
        const enter = document.createElement("button");
        enter.innerText = "Enter";
        enter.setAttribute("style", "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;");
        enterClearContainer.appendChild(enter);
        enter.onclick = function () {

            console.log(currentOp.length);

                if (error == false) {

                    if (checkForEnter == false) {

                        result = operators[currentOp[0]].function();
                        clearArgsArray();
                        clearOpsArray();
                        checkForEnter = true;
                        updateScreen();
                        return;
                    }
                }
        
                else return;
        }
    
    }
    
    function createClearBtn() {
        const clear = document.createElement("button");
        enterClearContainer.appendChild(clear);
        clear.innerText = "Clear";
        clear.setAttribute("style", "margin: 20px; border-radius: 10px; font-size: 32px; min-height: 30px; min-width: 100px;");
        clear.onclick = function clearScreen () {
    
            clearArgsArray();
            clearOpsArray();
            error = false;
            checkForEnter = false;
            screen.innerText = "";
        
        }
    }

}



function addArgsToArray(input) {

    if (currentOp.length == 0) {

        for (let i = 0; i < userInput.length; i++) {
            input = userInput[i] + input;
        }

        console.log("input is " + input)

        clearArgsArray();

        userInput.push(input);

    }

    else if (currentOp.length == 1) {
            for (let i = 1; i < userInput.length; i++) {
            
            input = userInput[1] + input;
    
            
            }
            userInput.splice(1, 1);
            userInput.push(input);

    }

    else {

        userInput.push(input);

    }

}


function clearArgsArray () {

    while (userInput.length > 0) {
        userInput.pop();
    }

}

function clearOpsArray () {

    while (currentOp.length > 0) {
        currentOp.pop();
    }
}

let error = false;

function errorCheck () {
    console.log("currentOp length is" + currentOp.length)

    if (currentOp.length > 1) {

        if (checkForEnter == false) {
    
        console.log("error");
        screen.innerText = "Error!";
        window.alert("Error! Please clear and try again.")

        error = true;

        clearArgsArray();
        clearOpsArray();

        return true;
        }
    }

    else {
        
        return false;}
}


/*

Enter needs to be its own function

I can access functions in my array from the Enter button, but I do need to be able to call them from the string value in the currentOp array

I need to find the correct object in the array by index (or key) the call the value (AKA the function) when enter is pressed

So, my onclick buttons should add a value to currentOp, not actually cause the function to run

Only when I hit enter should the function actually run

*/

