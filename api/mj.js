import OpenAI from "openai";

// Ta clé collée ici (remplace-la par ta vraie clé)
const openai = new OpenAI({
  apiKey: "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" // ta clé ici
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
          content: "Tu es un MJ de jeu de rôle. Réponds uniquement en JSON strict, avec : { \"scene\": string, \"choices\": [ { \"id\": string, \"label\": string } ] }. Ne renvoie jamais de texte en dehors de ce JSON."
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
      scene: "Le MJ s'est pris un coup critique.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
