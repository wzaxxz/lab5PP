import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../css/index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Ви успішно увійшли!");
      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("❌ Такого акаунту не існує, зареєструйтеся, будь ласка.");
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setMessage("❌ Неправильний email або пароль.");
      } else {
        setMessage("❌ Сталася помилка. Спробуйте ще раз.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Вхід</h2>
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
        <button type="submit">Увійти</button>
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

export default Login;
