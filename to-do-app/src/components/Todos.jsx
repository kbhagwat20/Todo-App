import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Add PropTypes validation (optional but recommended)
import PropTypes from "prop-types";
import axios from "axios";
import { format } from "date-fns";
import "../styles/Todos.css";

const Todos = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");

  // In your useEffect
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`/api/todos/${date}`);

        // Ensure we always get an array
        const data = Array.isArray(response.data) ? response.data : [];
        setTodos(data);
      } catch (err) {
        console.error(err);
        setTodos([]); // Reset to empty array on error
      }
    };
    fetchTodos();
  }, [date]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      try {
        const api = axios.create({
          baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000'
        });
        
        // Then use api instead of axios:
        const response = await api.post("/api/todos", {
          text: inputText,
          date: new Date(date),
          completed: false,
        });
        setTodos([...todos, response.data]);
        setInputText("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Define filteredTodos based on the current filter state
  const filteredTodos = (Array.isArray(todos) ? todos : []).filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <>
    <div className="navbar">
    <button onClick={() => navigate("/")} className="back-button">
        ← Back to Calendar
    </button>
    </div>
    <div className="todo-app">
      
      <h1>Todos for {format(new Date(date), "MMMM do, yyyy")}</h1>

      <div className="todo-app">
        <h1>Todo App</h1>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button type="submit">Add</button>
        </form>

        <div className="filter-buttons">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={filter === "active" ? "active" : ""}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "active" : ""}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo._id)}>×</button>
            </div>
          ))}
        </div>

        <div className="todo-count">
          {todos.filter((todo) => !todo.completed).length} items left
        </div>
      </div>
    </div>
    </>
  );
};

Todos.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Todos;
