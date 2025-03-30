import React, { useState } from 'react'
import Calendar from './components/Calendar.jsx'
import Todos from './components/Todos.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/todos/:date" element={<Todos />} />
      </Routes>
    </Router>
  )
}

export default App
