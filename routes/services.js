const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Получить список всех сервисов
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({ attributes: ['id', 'name', 'description', 'price'] });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить детальную информацию об одном сервисе
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
