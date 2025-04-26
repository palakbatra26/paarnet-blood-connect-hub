const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const UrgentRequest = require('../models/UrgentRequest');
const { body, validationResult } = require('express-validator');

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await UrgentRequest.find()
      .populate('createdBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await UrgentRequest.findById(req.params.id)
      .populate('createdBy', 'name email phone')
      .populate('fulfilledBy.donor', 'name email phone bloodType');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new request
router.post('/', auth, async (req, res) => {
  try {
    const request = new UrgentRequest({
      ...req.body,
      createdBy: req.user._id,
      status: 'pending'
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update request (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const request = await UrgentRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    Object.keys(req.body).forEach(key => {
      request[key] = req.body[key];
    });

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete request (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const request = await UrgentRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fulfill request
router.post('/:id/fulfill', auth, async (req, res) => {
  try {
    const request = await UrgentRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if request is still open
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer accepting donors' });
    }

    // Add donor to fulfilled list
    request.fulfilledBy.push({
      donor: req.user._id,
      units: req.body.units,
      date: new Date()
    });

    // Check if required units are met
    const totalUnits = request.fulfilledBy.reduce((sum, donation) => sum + donation.units, 0);
    if (totalUnits >= request.requiredUnits) {
      request.status = 'fulfilled';
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 