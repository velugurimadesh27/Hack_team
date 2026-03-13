const express = require('express');
const cors = require('cors');
const path = require('path');
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

if (process.env.NODE_ENV === 'production') {
  // Serve frontend static build
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));

  // Send index.html for any non-API route so client-side routing works.
  app.get(/.*/, (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Hack Team Builder API is running' });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
