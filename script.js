let editor;

window.onload = function() {
    editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        lineNumbers: true,
        mode: "javascript"
    });

    fetchQuestions();
};

function fetchQuestions() {
    fetch('http://localhost:3000/questions')
        .then(response => response.json())
        .then(data => {
            window.questions = data;
            const sidebar = document.querySelector('.sidebar ul');
            sidebar.innerHTML = '';
            data.forEach((question, index) => {
                const li = document.createElement('li');
                li.textContent = question.title;
                li.dataset.index = index;
                li.onclick = () => loadQuestion(index);
                sidebar.appendChild(li);
            });
        });
}

function loadQuestion(index) {
    const question = window.questions[index];
    const questionTitleElement = document.getElementById("question-title");
    questionTitleElement.innerText = question.title;
    questionTitleElement.dataset.index = index;
    document.getElementById("question-description").innerText = question.description;
    editor.setValue(question.functionSignature);
}

function submitCode() {
    const userCode = editor.getValue();
    const questionIndex = document.getElementById("question-title").dataset.index;
    const questionId = window.questions[questionIndex]._id;

    console.log('Submitting code for question:', questionId);

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionId, userCode })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.result || data.error);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the code.');
    });
}