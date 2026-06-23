const jwt = require('jsonwebtoken');
const Estate = require('../models/Estate');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.agent = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const agentOnly = async (req, res, next) => {
  try {
    const estate = await Estate.findById(req.params.id);
    if (!estate) return res.status(404).json({ message: 'Estate not found' });
    if (estate.agent.toString() !== req.agent.id) {
      return res.status(403).json({ message: 'Not authorized to modify this listing' });
    }
    req.estate = estate;
    next();
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyToken, agentOnly };
