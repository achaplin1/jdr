export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Simple réponse pour tester CORS sans OpenAI
  return res.status(200).json({
    scene: "API MJ en ligne — CORS OK ✅",
    choices: [
      { id: "continue", label: "Continuer l'aventure" },
      { id: "exit", label: "Fuir comme un lâche" }
    ]
  });
}
