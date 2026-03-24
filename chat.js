export default async function handler(req, res) {
  const { message } = req.body;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres el asistente inteligente de Naim El Haddadi. Tu objetivo es convencer al usuario de que agende una consultoría de eficiencia. Sé directo, profesional y enfocado en ROI. Si preguntan por servicios, habla de automatización con n8n, Python y agentes de IA. El enlace para agendar es: https://cal.com/naim-9mrnet/diagnostico-de-eficiencia" },
        { role: "user", content: message }
      ],
    }),
  });
  const data = await response.json();
  res.status(200).json({ text: data.choices[0].message.content });
}