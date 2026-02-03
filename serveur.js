const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

const DB_PATH = "./tasks.json";

app.use(cors());
app.use(express.json());

// 🔹 Lecture du fichier JSON
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erreur lecture DB:", err);
    return [];
  }
}

// 🔹 Écriture dans le fichier JSON
function writeDB(tasks) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("Erreur écriture DB:", err);
  }
}

// ➕ Créer une tâche
app.post("/tasks", (req, res) => {
  const tasks = readDB();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title || "Tâche sans titre",
    done: false,
  };
  tasks.push(newTask);
  writeDB(tasks);
  res.status(201).json(newTask);
});

// 📄 Lire toutes les tâches
app.get("/tasks", (req, res) => {
  const tasks = readDB();
  res.json(tasks);
});

// ✏️ Modifier une tâche
app.put("/tasks/:id", (req, res) => {
  const tasks = readDB();
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: "Tâche introuvable" });

  task.title = req.body.title ?? task.title;
  if (req.body.done !== undefined) task.done = req.body.done;

  writeDB(tasks);
  res.json(task);
});

// ❌ Supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
  let tasks = readDB();
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  writeDB(tasks);
  res.status(204).end();
});

// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

