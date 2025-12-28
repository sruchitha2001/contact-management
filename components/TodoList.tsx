"use client";

import { useState } from "react";
import { createTodo, deleteTodo, updateTodo } from "@/app/actions/todoActions";

interface Todo {
  id: number;
  task: string;
}

export default function TodoList({
  userId,
  initialTodos,
}: {
  userId: number;
  initialTodos: Todo[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <div>
      {/* CREATE */}
      <form
        action={async (formData) => {
          const task = formData.get("task") as string;
          await createTodo(userId, task);
          (document.getElementById("todo-form") as HTMLFormElement).reset();
        }}
        id="todo-form"
        className="flex gap-2 mb-6"
      >
        <input
          name="task"
          placeholder="What needs to be done?"
          className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Task
        </button>
      </form>

      {/* LIST / UPDATE / DELETE */}
      <ul className="space-y-3">
        {initialTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
          >
            {editingId === todo.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                />
                <button
                  onClick={async () => {
                    await updateTodo(todo.id, editText, userId);
                    setEditingId(null);
                  }}
                  className="text-green-600 text-sm font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="text-gray-700">{todo.task}</span>
            )}

            <div className="flex gap-4 ml-4">
              <button
                onClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.task);
                }}
                className="text-gray-400 hover:text-blue-500 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id, userId)}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
