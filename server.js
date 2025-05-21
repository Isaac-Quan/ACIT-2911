require('module-alias/register');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.json());
const authRoute = require('@routes/authRoute');
const indexRoute = require('@routes/indexRoute');
const courseRoute = require('@routes/courseRoute');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));



app.use(express.static(__dirname + '/public'));
app.use('/', authRoute);
app.use('/', indexRoute);
app.use('/', courseRoute);
app.use(express.static(path.join(__dirname, 'public')));


// app.listen(3000, () => {
//     console.log(`Server running at http://localhost:3000`);
// });
const PORT = process.env.PORT || 3000; // Use Heroku's assigned port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});




// integration test export:
module.exports = app;
