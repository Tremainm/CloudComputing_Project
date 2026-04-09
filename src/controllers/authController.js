// Handlers for registration, login, and push token storage.
//
// POST /auth/register - hash password with bcrypt, create User, return JWT
// POST /auth/login - verify password with bcrypt.compare, return JWT
// PUT  /auth/push-token - save Expo push token on the authenticated user record

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: sign a 7-day JWT containing the user's id and email
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /auth/register
// Body: { email, password }
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Reject if the email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash the password - 10 salt rounds is the industry standard default
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    const token = generateToken(user);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
};

// POST /auth/login
// Body: { email, password }
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message to avoid leaking whether the email exists
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // bcrypt.compare hashes the candidate and compares it to the stored hash
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// PUT /auth/push-token  (protected - requires valid JWT)
// Body: { pushToken }
exports.savePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    // req.user is set by the protect middleware
    await User.findByIdAndUpdate(req.user.id, { pushToken });

    res.json({ message: 'Push token saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving push token', error: err.message });
  }
};