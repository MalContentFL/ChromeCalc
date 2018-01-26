/*
Program: ChromeCalc
Description: The Minimalistic Pocket Calculator. Supports Basic Math Operators + - * / and ().
        Please report any bugs through the settings menu. Thanks!
Author: Quintin Kerns
Date: 1/25/2018
*/

// Sandbox for eval() since Chrome is mean :(

function evaluate(a){
    // Evaluate a
    try {
        return eval('' + a);
    } catch (error) {
        // prints different errors depending on error message
        if (error.message.indexOf("EvalError" != -1))
        {
            printResult(error.message);
        }
        else {
            printResult("ERR2");
        }
        console.log(error);
    }
}