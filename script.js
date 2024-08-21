const questions = [
    {
        title: "Question 1: Sum of Two Numbers",
        description: "Write a function that returns the sum of two numbers.",
        functionSignature: "function sum(a, b) {\n    // Your code here\n}"
    },
    {
        title: "Question 2: Reverse a String",
        description: "Write a function that reverses a string.",
        functionSignature: "function reverseString(str) {\n    // Your code here\n}"
    },
    {
        title: "Question 3: Find Maximum",
        description: "Write a function that finds the maximum number in an array.",
        functionSignature: "function findMax(arr) {\n    // Your code here\n}"
    },
    {
        title: "Question 4: Palindrome Check",
        description: "Write a function that checks if a string is a palindrome.",
        functionSignature: "function isPalindrome(str) {\n    // Your code here\n}"
    }
];

let editor;

window.onload = function() {
    editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        lineNumbers: true,
        mode: "javascript"
    });
};

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById("question-title").innerText = question.title;
    document.getElementById("question-description").innerText = question.description;
    editor.setValue(question.functionSignature);
}

function submitCode() {
    const userCode = editor.getValue();
    const testCases = [
        { input: [1, 2], expected: 3 },
        { input: [5, 5], expected: 10 }
    ];

    let passed = true;
    for (const testCase of testCases) {
        const result = eval(`(${userCode})(${testCase.input.join(",")})`);
        if (result !== testCase.expected) {
            passed = false;
            break;
        }
    }

    if (passed) {
        alert("All test cases passed!");
    } else {
        alert("Some test cases failed.");
    }
}