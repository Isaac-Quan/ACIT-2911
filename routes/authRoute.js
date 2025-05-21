const express = require('express');
const fs = require('fs');
const path = require('path'); 
const router = express.Router();
const usersFilePath = path.join(__dirname, '../users.json');

const dummyUser = {
    email: 'test@gmail.com',
    password: 'test'
};

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const { email, password } = req.body;
    console.log('Submitted credentials:', email, password);
    
    if (email === dummyUser.email && password === dummyUser.password) {
        req.session.userId = email;
        res.redirect('/index.html');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

router.post('/register', express.urlencoded({ extended: true }), (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    // Load existing users
    let users = {};
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(data);

        if (typeof users !== 'object' || users === null) {
            users = {}; // Ensure users is a valid object
        }
    } catch (error) {
        console.error('Error reading users file:', error);
    }

    // Check if email already exists
    if (users[email]) {
        return res.status(400).send('Email already registered');
    }

    // Add new user
    users[email] = {
        name: name,
        password: password,
        courses: {} // Initialize empty courses object
    };

    // Save updated users to file
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('New user registered:', email);
    } catch (error) {
        console.error('Error writing to users file:', error);
        return res.status(500).send('Internal server error');
    }

    req.session.userId = email;
    res.redirect('/index.html');
});


router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;


