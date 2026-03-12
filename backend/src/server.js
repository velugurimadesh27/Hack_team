const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const discoveryRoutes = require('./routes/discovery');
const teamsRoutes = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/teams', teamsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hack Team Builder API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
