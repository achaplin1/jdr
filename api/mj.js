import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Utilise une variable d’environnement

export default async function handler(req, res) {
  const { choice, room } = req.body;

  const messages = [
    {
      role: "system",
      content: "Tu es un maître du jeu de rôle. Tu inventes des scènes interactives et les renvoies en JSON avec une clé 'scene' (texte narratif) et 'choices' (liste d'objets { id, label }). Ne parle pas d'API ou de JSON, réponds directement en JSON pur."
    },
    {
      role: "user",
      content: `Le joueur a choisi : ${choice ?? "début de partie"}. Quelle est la prochaine scène ?`
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: "json"
    });

    const responseContent = completion.choices[0].message.content;
    const json = JSON.parse(responseContent); // Parse pour être sûr que c’est bien du JSON

    res.status(200).json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ scene: "Une erreur est survenue.", choices: [] });
  }
}
