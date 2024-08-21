const questions = [
    {
        title: "Question 1: Sum of Two Numbers",
        functionSignature: "function sum(a, b) {\n    // Your code here\n}"
    },
    {
        title: "Question 2: Reverse a String",
        functionSignature: "function reverseString(str) {\n    // Your code here\n}"
    },
    {
        title: "Question 3: Find Maximum",
        functionSignature: "function findMax(arr) {\n    // Your code here\n}"
    },
    {
        title: "Question 4: Palindrome Check",
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
