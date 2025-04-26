const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const UrgentRequest = require('../models/UrgentRequest');
const BloodCamp = require('../models/BloodCamp');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all urgent requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await UrgentRequest.find()
      .populate('createdBy', 'name email phone')
      .populate('fulfilledBy.donor', 'name email phone bloodType');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update request status
router.patch('/requests/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await UrgentRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all blood camps
router.get('/camps', adminAuth, async (req, res) => {
  try {
    const camps = await BloodCamp.find()
      .populate('registeredDonors', 'name email phone bloodType');
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      activeDonors,
      totalRequests,
      pendingRequests,
      totalCamps,
      upcomingCamps
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'donor', status: 'active' }),
      UrgentRequest.countDocuments(),
      UrgentRequest.countDocuments({ status: 'pending' }),
      BloodCamp.countDocuments(),
      BloodCamp.countDocuments({ date: { $gte: new Date() } })
    ]);

    res.json({
      totalUsers,
      totalDonors,
      activeDonors,
      totalRequests,
      pendingRequests,
      totalCamps,
      upcomingCamps
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 