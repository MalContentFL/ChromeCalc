/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports Basic Math Operators + - * / ^ % and ().
    Please report any bugs through the settings menu. Thanks!
Author: Quintin Kerns
Date: 1/25/2018
*/

console.log("Finished Loading HTML!");
let finishedLoadingScript = false;

// Checks localStorage for previously checked boxes and sets them checked.
document.getElementById("autoCopy").checked = localStorage.getItem("autoCopy");
document.getElementById("rememberInput").checked = localStorage.getItem("rememberInput");
document.getElementById("darkMode").checked = localStorage.getItem("darkMode");
document.getElementById("autoDarkMode").checked = localStorage.getItem("autoDarkMode");

// If rememberInput checkbox is checked, then load input from localStorage
if (document.getElementById("rememberInput").checked)
{
    document.getElementById("screen-text").value = localStorage.getItem("input");
}

// ---------------SETTINGS PAGE--------------- //
// Event Listener for the settings page button
let isSettingScreen = false;
let settingsBtn = document.getElementById("settingsBtn");

// Toggles between settings and calculator pages when settings button clicked (#settings display: none; in css)
settingsBtn.addEventListener("click", function (event) {
    if (isSettingScreen) {
        document.getElementById("settings").style.display = "none";
        document.getElementById("body").style.display = "block";
        isSettingScreen = false;
    } else {
        document.getElementById("body").style.display = "none";
        document.getElementById("settings").style.display = "block";
        isSettingScreen = true;
    }
});

// Event Listeners for Settings Check Boxes
let checkBoxArray = document.getElementsByClassName("settingsBox");
for (let i = 0; i < checkBoxArray.length; i++) {
    let checkBoxElement = checkBoxArray[i];
    switch (checkBoxElement.id) {
        case "autoCopy":
        checkBoxElement.addEventListener("click", function () {
                function settingsAutoCopy(event) {
                    if (event.target.checked)
                    {
                        localStorage.setItem("autoCopy", true);
                        document.getElementById("result").textContent.select();
                        document.execCommand("copy");
                    }
                    else {
                        localStorage.setItem("autoCopy", false);
                    }
                    
                }
            }, false);
        case "rememberInput":
        checkBoxElement.addEventListener("click", function () {
                function settingsRememberInput(event) {
                    if (event.target.checked)
                    {
                        localStorage.setItem("rememberInput", true);
                        //
                    }
                    else {
                        localStorage.setItem("rememberInput", false);
                    }
                }
            }, false);
        case "darkMode":
        checkBoxElement.addEventListener("click", function () {
                function settingsDarkMode(event) {
                    if (event.target.checked)
                    {
                        localStorage.setItem("darkMode", true);
                        //
                    }
                    else {
                        localStorage.setItem("darkMode", false);
                    }
                }
            }, false);
        case "autoDarkMode":
        checkBoxElement.addEventListener("click", function () {
                function settingsAutoDarkMode(event) {
                    if (event.target.checked)
                    {
                        localStorage.setItem("autoDarkMode", true);
                        //
                    }
                    else {
                        localStorage.setItem("autoDarkMode", false);
                    }
                }
            }, false);
    }
}

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
        input = math.eval(input);

        console.log("Output: " + input);
        printResult(input);
        if (document.getElementById("rememberInput").checked)
        {
            localStorage.setItem("input", input);
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

// ---------------CALCULATOR PAGE--------------- //

// Gets keys into an array
const keys = [].slice.call(document.getElementsByClassName("key"));
console.log("Keys: " + keys);

// Adds an event listener to every key
for (let i = 0; i < keys.length; i++) {
    keys[i].addEventListener("click", function () {
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