const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


// Utils DB
function readDB() {
  return JSON.parse(fs.readFileSync("db.json", "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
}

// GET toutes les tâches
app.get("/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

// GET une tâche par id
app.get("/tasks/:id", (req, res) => {
  const db = readDB();
  const task = db.tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

// POST créer une tâche
app.post("/tasks", (req, res) => {
  const db = readDB();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };

  db.tasks.push(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});

// PUT modifier une tâche
app.put("/tasks/:id", (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex(t => t.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  db.tasks[index] = { ...db.tasks[index], ...req.body };
  writeDB(db);
  res.json(db.tasks[index]);
});

// DELETE supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex(t => t.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deleted = db.tasks.splice(index, 1);
  writeDB(db);
  res.json(deleted[0]);
});

// Lancer serveur
app.listen(PORT, () => {
  console.log(`Serveur OK → http://localhost:${PORT}`);
});
//Explique ce code ligne par ligne je comprends rien et je suis débutant en node js
