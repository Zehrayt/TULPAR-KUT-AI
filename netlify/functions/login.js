// netlify/functions/login.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const loginData = JSON.parse(event.body);
    const n8nWebhookUrl = 'https://gulnihalgur.app.n8n.cloud/webhook/login';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(result) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Fonksiyon hatası:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Sunucuda bir hata oluştu.' })
    };
  }
};
