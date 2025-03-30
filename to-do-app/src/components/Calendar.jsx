import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Generate days array for calendar grid
  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfGrid = new Date(year, month, 1 - firstDayOfMonth.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(firstDayOfGrid);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Formatting helpers
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = generateDays();

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{formatMonthYear()}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="days-of-week">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>

      <div className="days-grid">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              className={`day 
                ${isCurrentMonth ? '' : 'other-month'} 
                ${isToday ? 'today' : ''} 
                ${isSelected ? 'selected' : ''}`}
              onClick={() => navigate(`/todos/${day.toISOString()}`)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;