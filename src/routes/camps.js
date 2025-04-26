const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const BloodCamp = require('../models/BloodCamp');

// Get all camps
router.get('/', async (req, res) => {
  try {
    const camps = await BloodCamp.find().sort({ date: 1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single camp
router.get('/:id', async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new camp (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const camp = new BloodCamp(req.body);
    await camp.save();
    res.status(201).json(camp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update camp (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    Object.keys(req.body).forEach(key => {
      camp[key] = req.body[key];
    });

    await camp.save();
    res.json(camp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete camp (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const camp = await BloodCamp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for camp
router.post('/:id/register', auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.registeredDonors.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this camp' });
    }

    camp.registeredDonors.push(req.user._id);
    await camp.save();
    res.json(camp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 