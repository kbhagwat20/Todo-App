const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// Database connection with proper options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Connection error:', err));

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.use(express.json());

// Schema and Model
const todoSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// 5. Define routes

app.get('/api/todos/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date)) {
      return res.status(400).json([]);
    }
    const todos = await Todo.find({ date });
    res.json(todos || []); // Always return array
  } catch (err) {
    res.status(500).json([]); // Return empty array on error
  }
});

app.post('/api/todos', async (req, res) => {

  // Add input validation
  if (!req.body.text || !req.body.date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const todo = new Todo({
    date: new Date(req.body.date),
    text: req.body.text,
    completed: req.body.completed
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Add validation
    );
    // Handle non-existent todo
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));