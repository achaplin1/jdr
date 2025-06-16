import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { choice } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu es un MJ de jeu de rôle. Réponds uniquement en JSON avec les clés 'scene' (texte) et 'choices' (tableau avec { id, label })."
        },
        {
          role: "user",
          content: `Voici le choix du joueur : ${choice ?? "début de partie"}`
        }
      ],
      response_format: "json"
    });

    const message = completion.choices[0].message.content;
    const json = typeof message === 'string' ? JSON.parse(message) : message;

    res.status(200).json(json);
  } catch (err) {
    console.error("Erreur MJ:", err);
    res.status(500).json({
      scene: "Erreur serveur. Le MJ s'est pris un critique.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
