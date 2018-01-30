/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports Basic Math Operators + - * / ^ % and ().
    Please report any bugs through the settings menu. Thanks!
Author: Quintin Kerns
Date: 1/25/2018
*/

console.log("Finished Loading HTML!");

let keys = document.getElementsByClassName("key");
console.log(keys);
// Convert keys to an Array from HTMLCollectionOf
keys = [].slice.call(keys);
// Put Event Listeners on all 16 keys
keys.forEach(function (element) {
    console.log("Element: " + element);
    element.addEventListener("click", function (e) {
        console.log("Pressed key: " + e.target.innerHTML);
        keyClick(e.target.innerHTML);
    })
})

function keyClick(inner) {
    console.log("inner: " + inner);
    // switch covers cases where we are not just adding a number/symbol to the screen-text
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

// Tries to calculate the value of screen-text, returns false if fails.
/*
    EVAL ERR: Evaluation Error
    UNKNOWN ERR: Chrome Extension-related Error, Etc.
    SYNTAX ERR: User Input Error
*/
function calculate(event) {
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

function cogOnClick(event) {
    if (!isSettingScreen) {
        document.getElementById("body").innerHTML = originalInnerHTML;
        isSettingScreen = false;
    } else {
        document.getElementById("body").innerHTML = settingsHTML;
        isSettingScreen = true;
    }
}

let settingsHTML = "hi";

// Function fired on checking the AutoCopy setting
// Automatically copies the answer to your clipboard after pressing = or ENTER
// function onCheckAutoCopy()
// {
//     document.getElementById("result").textContent.select();
//     document.execCommand("copy");
// }

// function settingsLocalStorageHandler()
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
    let i = 0, o = 0, c = 0;
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
                if ((input[i + 1] !== ")" && input[i + 1] !== "*") || i + 2 > input.length) {
                    input = insertStr(input, ')*', i);
                }
                i += 2;
                c++;
                break;
            default:
                console.log("No illegal char at " + i);
                break;
        }
        console.log(`Input at index ${i}: ` + input);
    }
    if (input.lastIndexOf("(") === input.length - 1 || input.lastIndexOf("*") === input.length -1)
    {
        input = input.substring(0,input.length-2);
    }
    if (o != c)
    {
        input = "SYNTAX ERR";
    }
    console.log("Done with Special Cases");
    return input;
}

// Various Event Listeners loaded after their respective functions
// Event Listener for the settings page button
document.getElementsByClassName("fa-cog")[0].addEventListener("click", cogOnClick(event))
// Event Listener for the screen-text
document.getElementById("screen-text").addEventListener("change", function () {
    calculate(event);
})