"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Trash2,
  PauseCircle,
  Tag,
  Calendar,
  User,
} from "lucide-react";

const PRIORITIES = {
  high: { label: "Urgent", color: "bg-red-100 text-red-700" },
  medium: { label: "Normal", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Plus tard", color: "bg-green-100 text-green-700" },
};

const TASK_STATUS = {
  active: { label: "En cours", icon: Circle, color: "text-blue-600" },
  paused: { label: "En pause", icon: PauseCircle, color: "text-orange-500" },
  completed: { label: "Terminée", icon: CheckCircle, color: "text-green-500" },
};

const CATEGORIES = [
  { id: "work", label: "Travail", color: "bg-blue-100 text-blue-700" },
  {
    id: "personal",
    label: "Personnel",
    color: "bg-purple-100 text-purple-700",
  },
  { id: "shopping", label: "Courses", color: "bg-green-100 text-green-700" },
  { id: "health", label: "Santé", color: "bg-red-100 text-red-700" },
  { id: "other", label: "Autre", color: "bg-gray-100 text-gray-700" },
];

const ASSIGNEES = [
  { id: "me", name: "Moi" },
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "charlie", name: "Charlie" },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("me");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const addTask = () => {
    if (text.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: text.trim(),
          status: "active",
          priority,
          category,
          dueDate,
          assignee,
          createdAt: new Date(),
        },
      ]);
      setText("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleStatus = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const statusOrder = ["active", "paused", "completed"];
          const currentIndex = statusOrder.indexOf(task.status);
          const nextStatus =
            statusOrder[(currentIndex + 1) % statusOrder.length];
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchTerm &&
      !task.text.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (filter === "completed") return task.status === "completed";
    if (filter === "active") return task.status === "active";
    if (filter === "paused") return task.status === "paused";
    if (filter === "overdue") {
      return (
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "completed"
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* En-tête */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">
          Gestionnaire de Tâches
        </h1>
        <p className="text-gray-600 mt-1">Organisez vos tâches efficacement</p>
      </div>

      {/* Formulaire d'ajout */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {Object.entries(PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {CATEGORIES.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {ASSIGNEES.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <button
            onClick={addTask}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        />
        <div className="flex flex-wrap gap-2">
          {["all", "active", "paused", "completed", "overdue"].map(
            (filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filter === filterType
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filterType === "all"
                  ? "Toutes"
                  : filterType === "active"
                  ? "En cours"
                  : filterType === "paused"
                  ? "En pause"
                  : filterType === "completed"
                  ? "Terminées"
                  : "En retard"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg ${
              task.status === "completed"
                ? "bg-gray-50"
                : task.status === "paused"
                ? "bg-orange-50"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(task.id)}
                className="focus:outline-none hover:scale-110 transition-transform"
              >
                {(() => {
                  const StatusIcon = TASK_STATUS[task.status].icon;
                  return (
                    <StatusIcon
                      className={`h-6 w-6 ${TASK_STATUS[task.status].color}`}
                    />
                  );
                })()}
              </button>
              <div className="flex-1">
                <span
                  className={`text-lg ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {task.text}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      CATEGORIES.find((c) => c.id === task.category)?.color
                    }`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {CATEGORIES.find((c) => c.id === task.category)?.label}
                  </span>
                  {task.dueDate && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        new Date(task.dueDate) < new Date() &&
                        task.status !== "completed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    <User className="h-3 w-3 mr-1" />
                    {ASSIGNEES.find((a) => a.id === task.assignee)?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            Aucune tâche pour le moment. Ajoutez-en une !
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Aperçu des tâches
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700">{tasks.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === "active").length}
            </p>
            <p className="text-sm text-blue-700">En cours</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">
              {tasks.filter((t) => t.status === "paused").length}
            </p>
            <p className="text-sm text-orange-700">En pause</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
            <p className="text-sm text-green-700">Terminées</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;