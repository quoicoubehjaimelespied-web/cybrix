const https = require('https');
const url = require('url');

const API_IP = '104.21.68.216';
const API_HOST = 'brixhub.net';

module.exports = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'X-API-Key, Content-Type'
        });
        return res.end();
    }

    const query = url.parse(req.url, true).query;
    const apiPath = query.path || 'v1/search';

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        const postData = body || '{}';

        const options = {
            hostname: API_IP,
            port: 443,
            path: '/api/' + apiPath,
            method: req.method,
            headers: {
                'X-API-Key': req.headers['x-api-key'] || '',
                'Content-Type': 'application/json',
                'User-Agent': 'Cybrix-Bot/2.0',
                'Host': API_HOST,
                'Content-Length': Buffer.byteLength(postData)
            },
            rejectUnauthorized: false
        };

        const apiReq = https.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => { data += chunk; });
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                res.end(data);
            });
        });

        apiReq.on('error', (err) => {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });

        apiReq.write(postData);
        apiReq.end();
    });

    req.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    });
};
