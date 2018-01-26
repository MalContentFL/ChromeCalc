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
// Convert keys to an array from HTMLCollectionOf
keys = [].slice.call(keys);
// Put Event Listeners on all 16 keys
keys.forEach(function (element) {
    console.log("Element: " + element);
    element.addEventListener("click", function (e) {
        keyClick(e.target.innerHTML);
    });
});

function keyClick(inner) {
    console.log("inner: " + inner);
    // switch covers cases where we are not just adding a number/symbol to the screen-text
    switch (inner) {
        // Clear screen-text
        case 'C':
            document.getElementById("screen-text").value = '';
            document.getElementById("result").innerHTML = '';
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
    ERR1: Input contains invalid characters
    ERR2: Evaluation Error
    ERR3: Chrome Extension-related Error
*/
function calculate() {
    let a = document.getElementById("screen-text").value;

    console.log("Input: " + a);

    // Make sure a is only numbers and operators
    if (!allNumeric(a) || a == undefined) {
        printResult("ERR1");
    } else {
        // Do specific things for certain characters so it evaluates correctly
        console.log("Cleansing a of ^ % ( )");
        // For ^
        for (var i = 0; i < a.length; i++) {
            if (a[i] == "^") {
                console.log("Detected ^ at: " + i);
                a = insertStr(a, '**', i);
                i += 2;
            }
            console.log("Index: " + i);
        }

        // For ( [Put a * before]
        for (var i = 0; i < a.length; i++) {
            if (a[i] == "(") {
                console.log("Detected ( at: " + i);
                a = insertStr(a, '*(', i);
                i += 2;
            }
            console.log("Index: " + i);
        }

        // For ) [Put a * after]
        for (var i = 0; i < a.length; i++) {
            if (a[i] == ")" && i + 1 < a.length) {
                console.log("Detected ) at: " + i);
                a = insertStr(a, ')*', i);
                i += 2;
            }
            console.log("Index: " + i);
        }

        a = evaluate(a);

        console.log("Output: " + a);
        printResult(a);
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

let isCalcScreen = true;
let originalInnerHTML = document.getElementById("body").innerHTML;

function cogOnClick() {
    console.log("Click!");
    if (!isCalcScreen) {
        document.getElementById("body").innerHTML = originalInnerHTML;
        isCalcScreen = true;
    } else {
        document.getElementById("body").innerHTML = settingsHTML;
        isCalcScreen = false;
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
function allNumeric(inputtxt) {
    // Allowed characters
    let numbers = /^[0-9,(,),+,\-,*,/,^,%,\.]+$/;
    // Makes sure inputtxt only has allowed chars
    if (new String(inputtxt).match(numbers)) {
        console.log("All Numeric!");
        return true;
    } else {
        console.log("Not Numeric!");
        return false;
    }
}