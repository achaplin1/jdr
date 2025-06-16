import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-xxx..." // ta vraie clé ici
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { choice } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: "json", // force JSON
      messages: [
        {
          role: "system",
          content: "Tu es un MJ de jeu de rôle. Réponds uniquement en JSON avec les clés : { \"scene\": string, \"choices\": [{ \"id\": string, \"label\": string }] }."
        },
        {
          role: "user",
          content: `Le joueur a choisi : ${choice ?? "début de partie"}`
        }
      ]
    });

    const raw = completion.choices[0].message.content;

    let json;
    try {
      json = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (e) {
      console.error("❌ JSON.parse échoué :", raw);
      throw new Error("Réponse GPT non parsable");
    }

    res.status(200).json(json);

  } catch (error) {
    console.error("❌ Erreur MJ finale :", error);
    res.status(500).json({
      scene: "Erreur MJ : réponse impossible à traiter.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
