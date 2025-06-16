export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  // ⚠️ Pas d'appel OpenAI ici
  return res.status(200).json({
    scene: "Fonction MJ opérationnelle. L'API fonctionne.",
    choices: [
      { id: "a", label: "Option A" },
      { id: "b", label: "Option B" }
    ]
  });
}
