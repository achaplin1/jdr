import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // sécurisée depuis Vercel
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
      response_format: "json",
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
    const json = typeof raw === "string" ? JSON.parse(raw) : raw;

    res.status(200).json(json);
  } catch (error) {
    console.error("❌ Erreur MJ :", error);
    res.status(500).json({
      scene: "Erreur MJ : il s'est évanoui dans une explosion magique.",
      choices: [{ id: "retry", label: "Réessayer" }]
    });
  }
}
