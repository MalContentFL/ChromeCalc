/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports All Scientific Math Operators and Unit Conversions.
Author: Quintin Kerns
*/

let finishedLoadingScript = false;

// Getters and Setters for sync storage
/*
    properties | data type | description
    ------------------------------------
    input: string, set when rememberInput is true
    autoCopy: boolean, set when settings checkbox is toggled
    rememberInput: boolean, set when settings checkbox is toggled
    darkMode: boolean, set when settings checkbox is toggled
    autoDarkMode: boolean, set when settings checkbox is toggled
*/

// Sets values for settings in sync storage on install to avoid issues where null/undefined
chrome.runtime.onInstalled.addListener(function () {
    let storageSettings = {
        input: '',
        autoCopy: false,
        rememberInput: true,
        darkMode: false,
        autoDarkMode: false
    }
    console.log("Sync Storage settings: " + storageSettings);
    chrome.storage.sync.set(storageSettings, function () {});
});

// Sets settings checkboxes to synced storage values
// Could proably optimize this using a for loop, but meh...
chrome.storage.sync.get(null, function (obj) {
    // 1st property of obj is input. So we start at 1 to get states for checkboxes
    for (let property in obj) {
        console.log(property + " -> " + obj[property]);
        if (document.getElementById(property) != null) {
            document.getElementById(property).checked = obj[property];
        }
    }
})

// If rememberInput checkbox is checked, then load input from sync storage
if (document.getElementById("rememberInput").checked) {
    document.getElementById("screen-text").value = chrome.storage.sync.get("input");
}

//  -----------------------------------------------------------
// All settings synced and ready. Start all dependent code here.
//  -----------------------------------------------------------

// Auto Dark Mode if slider checked.
if (document.getElementById("autoDarkMode").checked) {
    console.log(new Date().toLocaleTimeString());
    let date = new Date().toLocaleTimeString();
    if ((date.contains("PM") && date.substring(0, 1) > 8) ||
        (date.contains("AM") && date.substring(0, 1) < 8)) {
        enableDarkMode(true);
    } else {
        enableDarkMode(false);
    }
}

function enableDarkMode(enabled) {

}

// ---------------SETTINGS PAGE--------------- //
// Event Listener for the settings page button
let isSettingScreen = false;
let settingsBtn = document.getElementById("settingsBtn");

// Toggles between settings and calculator pages when settings button clicked
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
let settingsBoxArray = document.getElementsByClassName("settingsBox");
for (let i = 0; i < settingsBoxArray.length; i++) {
    let settingsElement = settingsBoxArray[i];
    console.log(settingsElement);
    settingsElement.addEventListener("click", function (event) {
        let checkBoxId = event.target.id;
        let checkBoxState = event.target.checked;
        switch (checkBoxId) {
            case "darkMode":
                // Change css classes for body and font color, etc. to switch to dark mode.
                if (event.target.checked) {
                    document.getElementById("autoDarkMode").disabled = false;
                } else {
                    document.getElementById("autoDarkMode").checked = false;
                    document.getElementById("autoDarkMode").disabled = true;
                    chrome.storage.sync.set({
                        "autoDarkMode": false
                    }, function () {});
                }
                break;
        }
        chrome.storage.sync.set({
            checkBoxId: checkBoxState
        }, function () {})
    });
}

// Tries to calculate the value of screen-text, returns false if fails.
/*
    EVAL ERR: Evaluation Error
    UNKNOWN ERR: Chrome Extension-related Error, Etc.
    SYNTAX ERR: User Input Error
*/
function calculate() {
    let input = document.getElementById("screen-text").value;
    let output;
    console.log("Input: " + input);
    // AJAX Request to MathJS API
    let urlEncodedInput = encodeURIComponent(input);
    console.log("Encoded Input: " + urlEncodedInput);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            output = this.responseText;
            console.log("Output: " + output);
            printResult(output);
        } else if (this.status == 400) {
            printResult("SYNTAX ERR");
        }
    };
    xhttp.open("GET", `http://api.mathjs.org/v1/?expr=${urlEncodedInput}`, true);
    xhttp.send();

    //
    if (document.getElementById("rememberInput").checked) {
        chrome.storage.sync.set(input, input);
    }
}

// Event Listener for the screen-text
document.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        console.log("Calculating...");
        calculate();
        // If autoCopy is on, select, copy, and deselect result.
        if (document.getElementById("autoCopy").checked) {
            document.getElementById("result").select();
            document.execCommand("copy");
            document.selection.empty();
        }
    }
}, false);

function printResult(res) {
    document.getElementById("result").innerHTML = res;
}

// ---------------CALCULATOR PAGE--------------- //

// Gets keys into an array
const keys = [].slice.call(document.getElementsByClassName("key"));
// console.log("Keys: " + keys);

// Adds an event listener to every key
for (let i = 0; i < keys.length; i++) {
    keys[i].addEventListener("click", function () {
        keyClick(event, keys[i]);
    }, false);
}

function keyClick(e, key) {
    // Keeps keys from being pressed when event listeners are applied before script is done loading.
    if (!finishedLoadingScript) {
        //console.log("Not finished loading");
        return;
    }
    // switch covers cases where we are not just adding a number/symbol to the screen-text
    let inner = key.innerHTML;
    switch (inner) {
        // Clear screen-text
        case "C":
            document.getElementById("screen-text").value = null;
            document.getElementById("result").innerHTML = null
            break;
            // Execute calculate()
        case "=":
            calculate();
            break;
        default:
            document.getElementById("screen-text").value += inner;
    }
}

finishedLoadingScript = true;
console.log("Finished Loading Script: " + finishedLoadingScript);