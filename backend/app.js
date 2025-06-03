// backend/app.js
require('dotenv').config(); // Завантажуємо змінні середовища з .env файлу
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Для роботи зі шляхами файлів

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Дозволити запити з різних джерел
app.use(express.json()); // Парсити JSON-тіла запитів

// Підключення до MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Маршрути API
const ratingsRouter = require('./routes/ratings');
app.use('/api/ratings', ratingsRouter);

// Обслуговування статичних файлів React-додатка
// Після того, як ви зберете (build) ваш React-додаток, статичні файли будуть у папці `build`
// У продакшені, Express буде обслуговувати ці файли.
app.use(express.static(path.join(__dirname, '../build'))); // Шлях до вашої React build папки

// Для всіх інших запитів, які не є API, надсилаємо файл index.html React-додатка
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}`);
});