// serveur.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// ======================
// Fonctions DB
// ======================
function readDB() {
  try {
    return JSON.parse(fs.readFileSync("db.json", "utf-8"));
  } catch (err) {
    console.error("Erreur lecture DB:", err);
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
}

// ======================
// Routes API
// ======================
app.get("/api/tasks", (req, res) => {
  const tasks = readDB();
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const tasks = readDB();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  writeDB(tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readDB();
  const taskIndex = tasks.findIndex(t => t.id == req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  writeDB(tasks);
  res.json(tasks[taskIndex]);
});

app.delete("/api/tasks/:id", (req, res) => {
  let tasks = readDB();
  tasks = tasks.filter(t => t.id != req.params.id);
  writeDB(tasks);
  res.json({ success: true });
});

// ======================
// Serve React Vite build
// ======================
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Catch-all pour React
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ======================
// Start server
// ======================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
