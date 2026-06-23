const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const API_IP = '104.21.68.216';
const API_HOST = 'brixhub.net';

app.use(express.json());
app.use(express.static(__dirname));

app.all('/api/proxy/*', async (req, res) => {
    try {
        const apiPath = req.params[0] || '';
        const url = `https://${API_IP}/api/${apiPath}`;
        const method = req.method.toLowerCase();
        const headers = {
            'X-API-Key': req.headers['x-api-key'] || '',
            'Content-Type': 'application/json',
            'User-Agent': 'Cybrix-Bot/2.0',
            'Host': API_HOST
        };

        const response = await axios({
            method,
            url,
            headers,
            data: req.body,
            params: req.query,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        res.status(response.status).json(response.data);
    } catch (err) {
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(502).json({ error: err.message });
        }
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Cyberix server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
