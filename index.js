const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Proxy endpoint for latest trades
app.get('/api/last', async (req, res) => {
    try {
        const url = 'https://frontend-api.pump.fun/trades/latest'; // Example URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json(); // Change to response.json() to handle JSON data correctly
        res.json(data);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error fetching the latest trades');
    }
});

// Proxy endpoint for coins
app.get('/api/coin', async (req, res) => {
    let { mint } = req.query; // Get the mint parameter from query parameters

    if (!mint) {
        return res.status(400).send(`Missing parameter mint address`);
    }

    try {
        const url = `https://frontend-api.pump.fun/coins/${mint}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json(); // Handle JSON response correctly
        res.json(data);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error fetching holders data');
    }
});

// Proxy endpoint for holders
app.get('/api/trades', async (req, res) => {
    let { mint, limit, offset, minimumSize } = req.query; // Get the mint parameter from query parameters

    if (!mint || !limit || !offset || !minimumSize) {
        // Find which parameter is missing
        const missingParams = [];
        if (!mint) missingParams.push('mint');
        if (!limit) missingParams.push('limit');
        if (!offset) missingParams.push('offset');
        if (!minimumSize) missingParams.push('minimumSize');
        
        return res.status(400).send(`Missing parameter(s): ${missingParams.join(', ')}`);
    }

    try {
        const url = `https://frontend-api.pump.fun/trades/all/${mint}?limit=${limit}&offset=${offset}&minimumSize=${minimumSize}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json(); // Handle JSON response correctly
        res.json(data);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error fetching holders data');
    }
});

// Proxy endpoint for latest trades
app.get('/api/koth', async (req, res) => {
    let { includeNsfw } = req.query; // Get the mint parameter from query parameters

    if (!includeNsfw) {
        includeNsfw = false;
    }

    try {
        const url = `https://frontend-api.pump.fun/coins/king-of-the-hill?includeNsfw=${includeNsfw}`; // Example URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json(); // Change to response.json() to handle JSON data correctly
        res.json(data);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error fetching the latest trades');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
