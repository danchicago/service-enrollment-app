const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе
const sequelize = require('./config/database');

// Подключение маршрутов
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/enrollments', require('./routes/enrollments'));

// Синхронизация базы (создание или обновление таблиц)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');

    // Запуск сервера после успешной синхронизации
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Sync error:', err);
  });
