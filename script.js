
const display = document.getElementById("display");
const question = document.getElementById("question");
const historyList = document.getElementById("history-list");

let justCalculated = false;

// Button se value add karna
function addValue(value) {
    if (display.innerText === "Error") {
        display.innerText = "0";
    }

    if (justCalculated) {
        if ("0123456789.".includes(value)) {
            display.innerText = "0";
            question.innerText = "Ready to calculate...";
        }
        justCalculated = false;
    }

    if (display.innerText === "0" && "0123456789".includes(value)) {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

// Screen clear karna
function clearDisplay() {
    display.innerText = "0";
    question.innerText = "Ready to calculate...";
    justCalculated = false;
}

// Last digit delete karna
function deleteLast() {
    if (display.innerText === "Error" || justCalculated) {
        display.innerText = "0";
        question.innerText = "Ready to calculate...";
        justCalculated = false;
        return;
    }

    display.innerText = display.innerText.slice(0, -1);

    if (display.innerText === "") {
        display.innerText = "0";
    }
}

// Calculation karna
function calculate() {
    let expression = display.innerText;

    if (!expression || expression === "0") {
        return;
    }

    try {
        // Sirf calculator ke allowed characters accept honge
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid");
        }

        // Last mein operator hone par calculation nahi hogi
        if (/[+\-*/%.]$/.test(expression)) {
            throw new Error("Invalid");
        }

        let result = Function('"use strict"; return (' + expression + ')')();

        // Divide by zero ya invalid result check
        if (!Number.isFinite(result)) {
            throw new Error("Math Error");
        }

        // Result ko 8 decimal places tak limit karna
        result = Number(result.toFixed(8));

        // Question aur answer screen par show karna
        question.innerText = expression + " =";
        display.innerText = result.toString();

        // History mein add karna
        addHistory(expression, result);

        justCalculated = true;

    } catch (error) {
        question.innerText = "Invalid Calculation";
        display.innerText = "Error";
        justCalculated = true;
    }
}

// Calculation history
function addHistory(expression, result) {
    if (!historyList) return;

    // Empty history message remove karna
    const emptyMessage = historyList.querySelector(".empty-history");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const item = document.createElement("div");
    item.className = "history-item";

    const oldCalculation = document.createElement("p");
    oldCalculation.innerText = expression + " =";

    const answer = document.createElement("h3");
    answer.innerText = result;

    item.appendChild(oldCalculation);
    item.appendChild(answer);

    historyList.prepend(item);
}

// History clear karna
function clearHistory() {
    if (!historyList) return;

    historyList.innerHTML = `
        <p class="empty-history">No calculations yet</p>
    `;
}

// Result copy karna
function copyResult() {
    const result = display.innerText;

    if (result === "Error" || result === "0") {
        question.innerText = "Nothing to copy";
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(result)
            .then(() => {
                question.innerText = "Result copied!";
            })
            .catch(() => {
                question.innerText = "Unable to copy result";
            });
    } else {
        question.innerText = "Copy not supported here";
    }
}

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if ("0123456789".includes(key)) {
        addValue(key);
    }

    else if (["+", "-", "*", "/", "%", "."].includes(key)) {
        addValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape" || key === "Delete") {
        clearDisplay();
    }
});
