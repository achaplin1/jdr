import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { choice } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: "json",
      messages: [
        {
          role: "system",
          content: "Tu es un MJ de jeu de rôle. Tu réponds uniquement en JSON avec les clés 'scene' (texte) et 'choices' (tableau d’objets avec 'id' et 'label'). Ne mets jamais de texte autour du JSON."
        },
        {
          role: "user",
          content: `Le joueur a choisi : ${choice ?? "début de partie"}`
        }
      ]
    });

    const message = response.choices[0].message.content;
    const json = typeof message === "string" ? JSON.parse(message) : message;

    res.status(200).json(json);

  } catch (error) {
    console.error("Erreur MJ :", error);
    res.status(500).json({
      scene: "Le MJ est tombé dans un piège magique.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
