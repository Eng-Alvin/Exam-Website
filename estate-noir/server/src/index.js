require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.routes');
const estatesRoutes = require('./routes/estates.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api', (_, res) => res.json({ status: 'ESTATE.NOIR API live' }));
app.use('/api/auth', authRoutes);
app.use('/api/estates', estatesRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`ESTATE.NOIR API running on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
