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
*/

// Sets values for settings in sync storage on install to avoid issues where null/undefined
chrome.runtime.onInstalled.addListener(function () {
    let storageSettings = {
        input: '',
        autoCopy: false,
        rememberInput: true
    }
    console.log("Sync Storage settings: " + storageSettings);
    chrome.storage.sync.set(storageSettings, function () {});
    for (let property in obj) {
        console.log(property + " -> " + obj[property]);
        if (document.getElementById(property) != null) {
            document.getElementById(property).checked = obj[property];
        }
    }
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

//  -----------------------------------------------------------
// All settings synced and ready. Start all dependent code here.
//  -----------------------------------------------------------

// If rememberInput checkbox is checked, then load input from sync storage
// if (document.getElementById("rememberInput").checked) {
//     chrome.storage.sync.get("input", function (obj) {
//         console.log("input obj key: " + Object.keys(obj)[0]);
//         document.getElementById("screen-text").value = Object.keys(obj)[0];
//     });
// }

// DEBUGGING
document.getElementsByClassName("logo-icon")[0].addEventListener("click", function () {
    chrome.storage.sync.get(null, function (obj) {
        console.log("Sync Storage Data: " + Object.entries(obj));
    })
});
document.getElementsByClassName("logo-icon")[0].addEventListener("dblclick", function () {
    console.log("Sync Storage Cleared.");
    chrome.storage.sync.clear();
});

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
    settingsElement.addEventListener("click", function () {
        let checkBoxId = event.target.id;
        let checkBoxState = event.target.checked;
        chrome.storage.sync.set({
            checkBoxId: checkBoxState
        }, function () {});
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
    try {
        xhttp.send();
    } catch (error) {
        printResult("NETWORK ERR");
    }

    // Save input to sync storage if setting is checked
    if (document.getElementById("rememberInput").checked) {
        chrome.storage.sync.set({
            "input": input
        }, function () {});
    }
}

// Event Listener for the screen-text
document.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        console.log("Calculating...");
        calculate();
        // If autoCopy is on, copy result.
        // if (document.getElementById("autoCopy").checked) {
        //     let textArea = document.createElement("textarea");
        //     // Edit styles to make textArea invisible
        //     textArea.style.position = 'fixed';
        //     textArea.style.top = 0;
        //     textArea.style.left = 0;
        //     textArea.style.width = '2em';
        //     textArea.style.height = '2em';
        //     textArea.style.padding = 0;
        //     textArea.style.border = 'none';
        //     textArea.style.outline = 'none';
        //     textArea.style.boxShadow = 'none';
        //     textArea.style.background = 'transparent';
        //     // Select and copy textArea contents
        //     textArea.value = document.getElementById("result").value;
        //     document.body.appendChild(textArea);
        //     textArea.focus();
        //     textArea.select();
        // }
    }
}, false);

function printResult(res) {
    document.getElementById("result").value = res;
    console.log("output value: " + document.getElementById("result").value);
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