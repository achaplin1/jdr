import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Gérer les pré-requêtes OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const { choice, room } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Tu es un MJ de jeu de rôle. Réponds uniquement en JSON avec les clés 'scene' et 'choices'." },
        { role: "user", content: `Voici le choix sélectionné : ${choice ?? "début"}` }
      ],
      response_format: "json"
    });

    const responseContent = completion.choices[0].message.content;
    const json = JSON.parse(responseContent); // Sécurisé
    res.status(200).json(json);
  } catch (error) {
    console.error("Erreur MJ:", error);
    res.status(500).json({
      scene: "Une erreur est survenue dans les coulisses du MJ...",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
