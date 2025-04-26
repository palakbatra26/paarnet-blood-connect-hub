const mongoose = require('mongoose');

const urgentRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  hospital: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  requiredUnits: {
    type: Number,
    required: true,
    min: 1
  },
  urgencyLevel: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fulfilledBy: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    units: {
      type: Number,
      required: true,
      min: 1
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  additionalNotes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UrgentRequest = mongoose.model('UrgentRequest', urgentRequestSchema);

module.exports = UrgentRequest; 