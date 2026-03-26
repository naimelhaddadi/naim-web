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
        { role: "system", content: "Eres el Agente Comercial de Naim El Haddadi. Tu misión es detectar cuál de estos 3 problemas tiene el usuario: 1. Lentitud en responder leads, 2. Tareas manuales de datos (PDF/Excel), o 3. Falta de seguimiento comercial. Una vez detectado el dolor, explícale que Naim automatiza eso con agentes de IA y n8n para recuperar 20h/semana. NO des soluciones técnicas largas. Tu único éxito es que hagan clic aquí para agendar un diagnóstico: https://cal.com/naim-9mrnet/diagnostico-de-eficiencia" },
        { role: "user", content: message }
      ],
    }),
  });
  const data = await response.json();
  res.status(200).json({ text: data.choices[0].message.content });
}