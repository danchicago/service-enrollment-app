const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Service = require('../models/Service');

// Получить все записи текущего пользователя
router.get('/', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Service, attributes: ['id', 'name', 'description', 'price'] }],
      order: [['enrolled_at', 'DESC']]
    });
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Записаться на услугу
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId } = req.body;
    // Проверка существования сервиса
    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Создание записи
    const enrollment = await Enrollment.create({
      user_id: req.user.id,
      service_id: serviceId,
      status: 'active',
      enrolled_at: new Date()
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Отменить запись
router.delete('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    enrollment.status = 'cancelled';
    enrollment.cancelled_at = new Date();
    await enrollment.save();

    res.json({ message: 'Enrollment cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
