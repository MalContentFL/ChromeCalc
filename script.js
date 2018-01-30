/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports Basic Math Operators + - * / ^ % and ().
    Please report any bugs through the settings menu. Thanks!
Author: Quintin Kerns
Date: 1/25/2018
*/

console.log("Finished Loading HTML!");
let finishedLoadingScript = false;

// Tries to calculate the value of screen-text, returns false if fails.
/*
    EVAL ERR: Evaluation Error
    UNKNOWN ERR: Chrome Extension-related Error, Etc.
    SYNTAX ERR: User Input Error
*/
function calculate() {
    let input = document.getElementById("screen-text").value;

    console.log("Input: " + input);

    // Make sure input is only numbers and operators
    if (!allNumeric(input) || input == undefined) {
        printResult("SYNTAX ERR");
    } else {
        input = characterSpecialCases(input);
        input = evaluate(input);

        console.log("Output: " + input);
        printResult(input);
        return true;
    }
}

// Event Listener for the screen-text
document.addEventListener("keypress", function (e) {
    // console.log("Keypress: " + e.key);
    if (e.key.toLocaleLowerCase() == "enter") {
        console.log("Calculating...");
        calculate();
    }
}, false);

function printResult(res) {
    document.getElementById("result").innerHTML = res;
}

// Inserts given String a given index, and asks to remove the char at index
function insertStr(startingStr, insertStr, index) {
    let beforeStr = startingStr.substring(0, index),
        afterStr = startingStr.substring(index + 1);

    console.log("NIndex: " + index);
    console.log("Before String: " + beforeStr);
    console.log("Insert String: " + insertStr);
    console.log("After String: " + afterStr);

    let finalStr = beforeStr + insertStr + afterStr;
    console.log("Final String: " + finalStr);
    return finalStr;
}

let isSettingScreen = false;
let originalInnerHTML = document.getElementById("body").innerHTML;

// Event Listener for the settings page button
let settingsHTML = "hi";
let settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", function () {
    if (isSettingScreen) {
        document.getElementById("body").innerHTML = originalInnerHTML;
        isSettingScreen = false;
    } else {
        document.getElementById("body").innerHTML = settingsHTML;
        isSettingScreen = true;
    }
});

// Function fired on checking the AutoCopy setting
// Automatically copies the answer to your clipboard after pressing = or ENTER
// function settingsAutoCopy()
// {
//     document.getElementById("result").textContent.select();
//     document.execCommand("copy");
// }

// command: get or set
// function settingsLocalStorageHandler(command, string)
// {

// }

// function settingsRememberLastInput()
// {

// }

function allNumeric(input) {
    // Allowed characters
    let numbers = /^[0-9,(,),+,\-,*,/,^,%,\.]+$/;
    // Makes sure input only has allowed chars
    if (input.match(numbers) || input === '') {
        console.log("All Numeric!");
        return true;
    } else {
        console.log("Not Numeric!");
        return false;
    }
}

function characterSpecialCases(input) {
    // Do specific things for certain characters so it evaluates correctly
    console.log(`Cleansing ${input} of ^ % ( )`);
    // Index, Open and Closed Parenthesis Counts
    let i = 0,
        o = 0,
        c = 0;
    for (i = 0; i < input.length; i++) {
        switch (input[i]) {
            case "^":
                console.log("^ at " + i);
                input = insertStr(input, '**', i);
                i += 2;
                break;
            case "(":
                console.log("( at " + i);
                if (input[i - 1] !== "(" && input[i - 1] !== "*") {
                    input = insertStr(input, '*(', i);
                }
                i += 2;
                o++;
                break;
            case ")":
                console.log(") at " + i);
                // Puts a * after a ) to avoid eval errors.
                if ((input[i + 1] !== ")" && input[i + 1] !== "*") || i + 2 > input.length) {
                    input = insertStr(input, ')*', i);
                    i += 2;
                }
                // There is a eval error if there is a "))" evaluated, so add a *1 to avoid.
                else if (input[i + 1] === ")") {
                    input = insertStr(input, ")*1", i);
                    i += 3;
                }
                c++;
                break;
            default:
                console.log("No illegal char at " + i);
                break;
        }
        console.log(`Input at index ${i}: ` + input);
    }
    // Removes extra ( or * leftover just incase to avoid eval/syntax error.
    if (input.lastIndexOf("(") === input.length - 1 || input.lastIndexOf("*") === input.length - 1) {
        input = input.substring(0, input.length - 1);
    }
    if (o != c) {
        input = "SYNTAX ERR";
    }
    console.log("Done with Special Cases");
    return input += ";";
}

// Gets keys into an array
const keys = [].slice.call(document.getElementsByClassName("key"));
console.log("Keys: " + keys);

// Adds an event listener to every key
for (let i = 0; i < keys.length; i++) {
    keys[i].addEventListener("click", function() {
        keyClick(event, keys[i]);
    }, false);
    console.log("Added event listener to: " + keys[i].innerHTML);
}

function keyClick(e, key) {
    if (!finishedLoadingScript) {
        //console.log("Not finished loading");
        return;
    }
    console.log(key.innerHTML + " Clicked.");
    // switch covers cases where we are not just adding a number/symbol to the screen-text
    let inner = key.innerHTML;
    switch (inner) {
        // Clear screen-text
        case 'C':
            document.getElementById("screen-text").value = null;
            document.getElementById("result").innerHTML = null
            break;
            // Execute calculate()
        case '=':
            calculate();
            break;
        default:
            document.getElementById("screen-text").value += inner;
    }
}

finishedLoadingScript = true;
console.log("Finished Loading Script: " + finishedLoadingScript);