// netlify/functions/register.js

// n8n'e istek atmak için node-fetch kütüphanesini kullanacağız.
// Projenize bunu eklemeniz gerekecek.
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Netlify fonksiyonları sadece POST metoduyla gelen istekleri kabul etsin
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Frontend'den gelen kullanıcı verilerini al
    const userData = JSON.parse(event.body);
    
    // n8n webhook URL'niz
    const n8nWebhookUrl = 'https://gulinhalgur.app.n8n.cloud/webhook/register';

    // n8n'e isteği gönder
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    // n8n'den gelen yanıtı al
    const result = await response.json();
    
    // n8n'den gelen yanıt başarısızsa, hatayı aynen frontend'e ilet
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(result)
      };
    }

    // Her şey yolundaysa, n8n'den gelen başarılı yanıtı frontend'e gönder
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Fonksiyon hatası:', error);
    // Genel bir sunucu hatası durumunda bu yanıtı gönder
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Sunucuda bir hata oluştu.' })
    };
  }
};
