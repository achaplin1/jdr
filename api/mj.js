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
          content: `Voici le choix sélectionné par le joueur : ${choice ?? "début de partie"}`
        }
      ],
      response_format: "json"
    });

    const message = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = typeof message === "string" ? JSON.parse(message) : message;
    } catch (parseError) {
      console.error("❌ Erreur de parsing JSON GPT :", message);
      return res.status(500).json({
        scene: "Erreur MJ : la réponse de l'IA est mal formatée.",
        choices: [{ id: "retry", label: "Réessayer" }]
      });
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ Erreur serveur MJ :", error);
    res.status(500).json({
      scene: "Le MJ s'est évanoui dans un vortex de bugs.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
