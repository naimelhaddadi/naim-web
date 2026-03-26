import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Eres el asistente inteligente de Naim El Haddadi, experto en Ingeniería de Eficiencia e IA. Tu objetivo es convencer al usuario de que agende una consultoría de eficiencia. Sé directo, profesional y enfocado en ROI. Si preguntan por servicios, habla de automatización con n8n, Python y agentes de IA. El enlace para agendar es: https://cal.com/naim-9mrnet/diagnostico-de-eficiencia. Menciona que Naim puede ahorrarles miles de euros al año automatizando tareas repetitivas." 
          },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ text: "Lo siento, mi conexión con el servidor de ingeniería se ha interrumpido. ¿Podrías agendar una llamada directa con Naim en https://cal.com/naim-9mrnet/diagnostico-de-eficiencia?" });
  }
}