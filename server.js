require('module-alias/register');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const authRoute = require('@routes/authRoute');
const indexRoute = require('@routes/indexRoute');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));
app.use('/', authRoute);
app.use('/', indexRoute);
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});



// integration test export:
module.exports = app;
