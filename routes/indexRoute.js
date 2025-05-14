const express = require('express');
const path = require('path');
const checkAuth = require('@middleware/checkAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

router.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/task.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/task.html'));
});

module.exports = router;
