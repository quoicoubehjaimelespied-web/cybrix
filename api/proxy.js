const axios = require('axios');

const API_IP = '104.21.68.216';
const API_HOST = 'brixhub.net';

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
        return res.status(200).end();
    }

    try {
        const apiPath = req.query.path || 'v1/search';
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
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(response.status).json(response.data);
    } catch (err) {
        if (err.response) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(502).json({ error: err.message });
        }
    }
};
