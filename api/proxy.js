const https = require('https');
const { URL } = require('url');

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
        const body = await new Promise((resolve) => {
            let chunks = [];
            req.on('data', c => chunks.push(c));
            req.on('end', () => resolve(Buffer.concat(chunks).toString() || '{}'));
        });

        const apiPath = req.query.path || 'v1/search';
        const method = req.method.toUpperCase();

        const options = {
            hostname: API_IP,
            port: 443,
            path: `/api/${apiPath}`,
            method,
            rejectUnauthorized: false,
            headers: {
                'X-API-Key': req.headers['x-api-key'] || '',
                'Content-Type': 'application/json',
                'User-Agent': 'Cybrix-Bot/2.0',
                'Host': API_HOST,
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const apiRes = await new Promise((resolve, reject) => {
            const apiReq = https.request(options, resolve);
            apiReq.on('error', reject);
            apiReq.write(body);
            apiReq.end();
        });

        const data = await new Promise((resolve) => {
            let chunks = [];
            apiRes.on('data', c => chunks.push(c));
            apiRes.on('end', () => resolve(Buffer.concat(chunks).toString()));
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(apiRes.statusCode);
        try { res.json(JSON.parse(data)); } catch { res.send(data); }
    } catch (err) {
        res.status(502).json({ error: err.message });
    }
};
