// seed.js
const sequelize = require('./config/database');
const Service = require('./models/Service');

const seedServices = async () => {
  await sequelize.sync({ force: true }); // Удаляет и пересоздаёт таблицы

  await Service.bulkCreate([
    {
      name: 'Virtual Book Club',
      description: 'Join monthly book discussions.',
      price: 10.00,
    },
    {
      name: 'Online Yoga',
      description: 'Daily yoga sessions for all levels.',
      price: 15.00,
    },
    {
      name: 'Coding Workshop',
      description: 'Learn coding with expert mentors.',
      price: 20.00,
    },
  ]);

  console.log('Seed data inserted');
  process.exit();
};

seedServices().catch(console.error);
