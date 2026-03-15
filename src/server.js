require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeRepo } = require('./githubAnalyzer');
const { generateRoast } = require('./roastEngine');

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Main roast endpoint
app.post('/api/roast', async (req, res) => {
    // ... code omitted for brevity but actually replacing correctly ...
});

// Health check / API status page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🔥 Server chal raha hai port ${PORT} pe`);
});