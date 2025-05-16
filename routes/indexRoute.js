const express = require('express');
const path = require('path');
const checkAuth = require('@middleware/checkAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

router.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
  });

router.get('/index.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/task.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/task.html'));
});

router.get('/courses.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/courses.html'));
});

router.get('/instruction.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/instruction.html'));
});

const fs = require('fs');

router.get('/api/tasks', checkAuth, (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Could not load tasks.' });
      const tasks = JSON.parse(data);
      const userTasks = tasks[req.session.userId] || {};
      res.json(userTasks);
    });
  });
  
  router.post('/api/saveTasks', checkAuth, (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
      let tasks = {};
      if (!err) {
        tasks = JSON.parse(data);
      }
  
      tasks[req.session.userId] = req.body;
  
      fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Could not save tasks.' });
        res.json({ success: true });
      });
    });
  });
  

module.exports = router;