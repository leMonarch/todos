"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  async function addTodo() {
    if (!input.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: input }),
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setInput("");
  }

  async function deleteTodo(id: number) {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((t) => t.id !== id));
  }

  async function toggleTodo(id: number, done: boolean) {
    await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, done: !done }),
    });
    setTodos(todos.map((t) => t.id === id ? { ...t, done: !done } : t));
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Nouvelle tâche..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border rounded px-3 py-2"
          >
            <span
              onClick={() => toggleTodo(todo.id, todo.done)}
              className={`cursor-pointer ${todo.done ? "line-through text-gray-400" : ""}`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}