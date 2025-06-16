import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // CORS
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
      messages: [
        {
          role: "system",
          content: "Tu es un maître du jeu de rôle. Tu renvoies toujours du JSON avec 'scene' (texte narratif) et 'choices' (liste d'objets avec 'id' et 'label'). Ne mets aucun texte en dehors du JSON."
        },
        {
          role: "user",
          content: `Le joueur a choisi : ${choice ?? "début de partie"}`
        }
      ],
      response_format: "json"
    });

    const message = response.choices[0].message.content;

    // Si GPT renvoie déjà un objet parsable
    const json = typeof message === "string" ? JSON.parse(message) : message;
    res.status(200).json(json);

  } catch (err) {
    console.error("Erreur MJ:", err);
    res.status(500).json({
      scene: "Le MJ a perdu connaissance. Veuillez réessayer.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
