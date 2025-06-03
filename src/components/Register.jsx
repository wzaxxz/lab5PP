import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../css/index.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("✅ Реєстрація успішна! Перенаправлення...");
      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMessage("❌ Такий email вже зареєстрований.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("❌ Невірний формат email.");
      } else if (error.code === "auth/weak-password") {
        setMessage("❌ Пароль має містити щонайменше 6 символів.");
      } else {
        setMessage("❌ Сталася помилка. Спробуйте ще раз.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Реєстрація</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зареєструватися</button>
        {message && (
          <p
            className={`auth-message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
