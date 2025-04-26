const mongoose = require('mongoose');

const bloodCampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  maxDonors: {
    type: Number,
    required: true
  },
  registeredDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  description: {
    type: String,
    trim: true
  },
  requirements: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BloodCamp = mongoose.model('BloodCamp', bloodCampSchema);

module.exports = BloodCamp; 