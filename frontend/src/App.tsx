import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

interface Task {
  id: number;
  title: string;
  done: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data: Task[] = await res.json();
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newTask: Task = await res.json();
    setTasks([...tasks, newTask]);
    setTitle("");
  };

  const updateTask = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const updated: Task = await res.json();
    setTasks(tasks.map(t => t.id === id ? updated : t));
    setEditId(null);
    setTitle("");
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleDone = async (task: Task) => {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    const updated: Task = await res.json();
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nom de la tâche"
        />
        {editId !== null ? (
          <button className="modify" onClick={() => updateTask(editId!)}>Modifier</button>
        ) : (
          <button onClick={addTask}>Ajouter</button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tâche</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td className={task.done ? "done" : ""}>{task.title}</td>
              <td>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task)}
                />
              </td>
              <td>
                <button className="modify" onClick={() => { setEditId(task.id); setTitle(task.title); }}>
                  Modifier
                </button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

