// BASIC EXPRESS SERVER
// USE npm start to develop from now on
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Serve static files

app.get('/', (req, res) => {
    // load index.html
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

const PORT = 3000; // LETS STICK TO 3000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

