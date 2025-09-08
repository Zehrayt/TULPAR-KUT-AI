// netlify/functions/get-analysis-data.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const requestData = JSON.parse(event.body);
    const n8nWebhookUrl = 'https://gulniihalgur.app.n8n.cloud/webhook/get-analysis-data';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    const result = await response.json();
    return { statusCode: response.status, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Analiz verisi alınamadı.' }) };
  }
};
