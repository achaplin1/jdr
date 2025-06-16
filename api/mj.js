export default async function handler(req, res) {
  const { choice, room } = req.body;

  // Exemples de réponses simples en attendant l’IA
  const defaultScene = {
    scene: "Choisissez un thème d'aventure.",
    choices: [
      { id: "donjon", label: "Donjon Maudit Médiéval-Fantastique" },
      { id: "cyberpunk", label: "Cyberpunk dystopique" },
      { id: "espace", label: "Station spatiale abandonnée" },
      { id: "zombie", label: "Post-apocalypse zombie" },
      { id: "manoir", label: "Enquête paranormale dans un manoir" }
    ]
  };

  res.status(200).json(defaultScene);
}
