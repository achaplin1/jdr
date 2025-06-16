import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.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 });

export default async function handler(req, res) {
  const { choice, room } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Tu es un MJ de jeu de rôle. Réponds uniquement en JSON." },
      { role: "user", content: `Voici le choix sélectionné : ${choice}. Quelle est la prochaine scène ?` }
    ],
    response_format: "json"
  });

  res.status(200).json(completion.choices[0].message.content);
}
