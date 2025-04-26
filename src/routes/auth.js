const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration data:', req.body);
    
    const { name, email, password, bloodType, phone, address, age, medicalConditions } = req.body;

    // Log all received fields
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Blood Type:', bloodType);
    console.log('Phone:', phone);
    console.log('Address:', address);
    console.log('Age:', age);
    console.log('Medical Conditions:', medicalConditions);

    // Validate required fields
    const missingFields = {};
    if (!name) missingFields.name = 'Name is required';
    if (!email) missingFields.email = 'Email is required';
    if (!password) missingFields.password = 'Password is required';
    if (!bloodType) missingFields.bloodType = 'Blood type is required';
    if (!phone) missingFields.phone = 'Phone number is required';
    if (!address) missingFields.address = 'Address is required';
    if (!age) missingFields.age = 'Age is required';

    if (Object.keys(missingFields).length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: missingFields
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate age
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 65) {
      console.log('Invalid age:', age);
      return res.status(400).json({ message: 'Age must be between 18 and 65' });
    }

    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      console.log('Invalid blood type:', bloodType);
      return res.status(400).json({ message: 'Invalid blood type' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      bloodType,
      phone: phone.trim(),
      address: address.trim(),
      age: parsedAge,
      medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : [],
      role: 'donor',
      status: 'pending'
    });

    console.log('Creating new user:', {
      name: user.name,
      email: user.email,
      bloodType: user.bloodType,
      phone: user.phone,
      age: user.age,
      role: user.role,
      status: user.status
    });

    await user.save();
    console.log('User saved successfully with ID:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        message: 'Validation failed',
        details: validationErrors
      });
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error:', error.keyValue);
      return res.status(400).json({
        message: 'Email already registered',
        details: { email: 'This email is already registered' }
      });
    }

    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 