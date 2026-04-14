const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    // Validate required fields with detailed messages
    if (!name) {
      return res.status(400).json({ 
        error: 'Name is required',
        reason: 'Please provide your full name to register',
        code: 'MISSING_NAME'
      });
    }

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required',
        reason: 'Please provide a valid email address',
        code: 'MISSING_EMAIL'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        reason: 'Please enter a valid email address (e.g., user@example.com)',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    if (!password) {
      return res.status(400).json({ 
        error: 'Password is required',
        reason: 'Please provide a password (minimum 6 characters)',
        code: 'MISSING_PASSWORD'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password too short',
        reason: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    if (!role) {
      return res.status(400).json({ 
        error: 'Role is required',
        reason: 'Please select either "HR Manager" or "Candidate"',
        code: 'MISSING_ROLE'
      });
    }

    if (role === 'HR' && !company) {
      return res.status(400).json({ 
        error: 'Company name is required for HR role',
        reason: 'HR managers must provide their company name',
        code: 'MISSING_COMPANY'
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ 
        error: 'Email already registered',
        reason: `The email "${email}" is already in use. Please use a different email or try logging in`,
        code: 'EMAIL_ALREADY_EXISTS',
        suggestion: 'Try logging in with this email or use a different email address'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      company: role === 'HR' ? company : undefined,
      phone
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        reason: messages.join(', '),
        code: 'VALIDATION_ERROR'
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        error: `${field} already exists`,
        reason: `This ${field} is already registered in the system`,
        code: 'DUPLICATE_FIELD'
      });
    }

    res.status(500).json({ 
      error: 'Registration failed',
      reason: 'An unexpected error occurred. Please try again later',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required',
        reason: 'Please provide your registered email address',
        code: 'MISSING_EMAIL'
      });
    }

    if (!password) {
      return res.status(400).json({ 
        error: 'Password is required',
        reason: 'Please provide your password',
        code: 'MISSING_PASSWORD'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        reason: 'Please enter a valid email address (e.g., user@example.com)',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Email not found',
        reason: `No account exists with the email "${email}". Please register first or check if the email is correct`,
        code: 'USER_NOT_FOUND',
        suggestion: 'If you don\'t have an account, please register'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Incorrect password',
        reason: 'The password you entered is incorrect. Please try again',
        code: 'INVALID_PASSWORD',
        suggestion: 'If you forgot your password, please contact support'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      reason: 'An unexpected error occurred during login. Please try again',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getProfile };
