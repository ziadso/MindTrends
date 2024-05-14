const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static('.'));

// Optionally serve data.json via a specific route if required
app.get('/api/data', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
