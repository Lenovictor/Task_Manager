const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ========== DB Utils ==========
function readDB() {
  try {
    return JSON.parse(fs.readFileSync("db.json", "utf-8"));
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
}

// ========== API Routes ==========
app.get("/api/tasks", (req, res) => res.json(readDB()));

app.post("/api/tasks", (req, res) => {
  const tasks = readDB();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  writeDB(tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readDB();
  const idx = tasks.findIndex(t => t.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  tasks[idx] = { ...tasks[idx], ...req.body };
  writeDB(tasks);
  res.json(tasks[idx]);
});

app.delete("/api/tasks/:id", (req, res) => {
  let tasks = readDB();
  tasks = tasks.filter(t => t.id != req.params.id);
  writeDB(tasks);
  res.json({ success: true });
});

// ========== Serve React build ==========
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Catch-all pour toutes les autres routes
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ========== Start server ==========
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


