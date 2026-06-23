const API_IP = '104.21.68.216';
const API_HOST = 'brixhub.net';

export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'X-API-Key, Content-Type'
            }
        });
    }

    const apiPath = url.searchParams.get('path') || 'v1/search';
    const targetUrl = `https://${API_IP}/api/${apiPath}`;
    const body = request.method === 'POST' ? await request.text() : null;

    const headers = {
        'X-API-Key': request.headers.get('X-API-Key') || '',
        'Content-Type': 'application/json',
        'User-Agent': 'Cybrix-Bot/2.0',
        'Host': API_HOST
    };

    const apiResponse = await fetch(targetUrl, {
        method: request.method,
        headers: headers,
        body: body,
        cf: { dangerouslyDisableHostCheck: true }
    });

    const responseBody = await apiResponse.text();

    return new Response(responseBody, {
        status: apiResponse.status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    });
}
