/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports Basic Math Operators + - * / and ().
        Please report any bugs through the settings menu. Thanks!
Author: Quintin Kerns
Date: 1/25/2018
*/

// Sandbox for eval() since Chrome is mean :(

function evaluate(input){
    try {
        input = eval('' + input);
    } catch (error) {
        // prints different errors depending on error message
        input = "EVAL ERR";
        console.log(error);
    }
    return input;
}