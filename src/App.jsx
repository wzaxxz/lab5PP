import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Events from "./components/Events";
import Bookings from "./components/Bookings";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import './css/index.css';

function App() {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const cancelBooking = (index) => {
    const confirmed = window.confirm("Ви дійсно хочете скасувати це бронювання?");
    if (confirmed) {
      const updated = [...bookings];
      updated.splice(index, 1);
      setBookings(updated);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/events" element={<Events addBooking={addBooking} />} />
          <Route path="/bookings" element={<Bookings bookings={bookings} onCancel={cancelBooking} />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
