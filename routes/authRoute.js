const express = require('express');
const path = require('path'); 
const router = express.Router();

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
        req.session.user = email;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;


