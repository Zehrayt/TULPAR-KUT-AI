const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Sadece POST isteklerini kabul et
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Frontend'den gelen veriyi al
    const requestData = JSON.parse(event.body);
    
    // n8n webhook URL'si (doğru yazıldığından emin olun)
    const n8nWebhookUrl = 'https://gulniihalgur.app.n8n.cloud/webhook/generate-report';

    // n8n'e isteği gönder
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    // n8n'den gelen yanıtı al
    const result = await response.json();
    
    // n8n'den gelen yanıtı ve durum kodunu aynen frontend'e geri gönder
    return {
      statusCode: response.status,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Rapor oluşturma fonksiyonunda hata:', error);
    // Genel bir sunucu hatası durumunda bu yanıtı gönder
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Rapor oluşturulurken sunucuda bir hata oluştu.' })
    };
  }
};
