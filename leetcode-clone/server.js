const express = require('express');
const bodyParser = require('body-parser');
const { VM } = require('vm2');
const cors = require('cors');
const { connectDB } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/questions', async (req, res) => {
    const db = await connectDB();
    const questions = await db.collection('questions').find().toArray();
    res.json(questions);
});

app.post('/submit', async (req, res) => {
    const { questionId, userCode } = req.body;
    console.log('Received submission:', { questionId, userCode });

    if (!ObjectId.isValid(questionId)) {
        console.error('Invalid question ID format:', questionId);
        return res.status(400).json({ error: 'Invalid question ID format' });
    }

    const db = await connectDB();
    let question;

    try {
        question = await db.collection('questions').findOne({ _id: new ObjectId(questionId) });
        console.log('Found question:', question);

        if (!question) {
            console.error('Question not found for ID:', questionId);
            return res.status(404).json({ error: 'Question not found' });
        }

        const vm = new VM({
            timeout: 1000,
            sandbox: {}
        });

        let passed = true;
        for (const testCase of question.testCases) {
            try {
                const result = vm.run(`(${userCode})(${JSON.stringify(testCase.input).slice(1, -1)})`);
                if (result !== testCase.expected) {
                    passed = false;
                    break;
                }
            } catch (e) {
                passed = false;
                break;
            }
        }

        // Save the submitted code to MongoDB
        const submission = {
            questionId: question._id,
            userCode,
            passed,
            timestamp: new Date()
        };

        try {
            const result = await db.collection('submissions').insertOne(submission);
            console.log('Submission saved:', result);
        } catch (e) {
            console.error('Error saving submission:', e);
        }

        if (passed) {
            res.json({ result: 'All test cases passed!' });
        } else {
            res.json({ result: 'Some test cases failed.' });
        }
    } catch (e) {
        console.error('Error finding question:', e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/add-question', async (req, res) => {
    const { title, description, functionSignature, testCases } = req.body;
    const db = await connectDB();

    const newQuestion = {
        _id: new ObjectId(),
        title,
        description,
        functionSignature,
        testCases
    };

    try {
        await db.collection('questions').insertOne(newQuestion);
        res.json({ message: 'Question added successfully', questionId: newQuestion._id });
    } catch (e) {
        console.error('Error adding question:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});