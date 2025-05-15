const express = require('express');
const path = require('path');
const checkAuth = require('@middleware/checkAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

router.get('/index.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/task.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/task.html'));
});




const fs = require('fs');

router.post('/api/saveTasks', (req, res) => {
    fs.writeFile('tasks.json', JSON.stringify(req.body, null, 2), err => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Failed to save tasks.' });
        }
        res.send({ message: 'Tasks saved successfully.' });
    });
});

router.get('/api/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.json([]);
        }
        res.json(JSON.parse(data));
    });
});


module.exports = router;
