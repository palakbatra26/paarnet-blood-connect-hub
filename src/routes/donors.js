const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get all donors (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donors = await User.find({ role: 'donor' }).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single donor
router.get('/:id', auth, async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donor status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donor = await User.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    donor.status = req.body.status;
    await donor.save();
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 