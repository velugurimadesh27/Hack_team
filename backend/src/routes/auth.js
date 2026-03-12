const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, github_link, university, location, bio, experience_level, skills, roles } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (name, email, password_hash, phone, github_link, university, location, bio, experience_level) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, phone, github_link, university, location, bio, experience_level],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already in use.' });
          }
          return res.status(500).json({ error: 'Database error.' });
        }

        const userId = this.lastID;

        // Insert Skills
        if (skills && Array.isArray(skills)) {
          const skillStmt = db.prepare('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)');
          skills.forEach(skill => skillStmt.run(userId, skill));
          skillStmt.finalize();
        }

        // Insert Roles
        if (roles && Array.isArray(roles)) {
          const roleStmt = db.prepare('INSERT INTO roles (user_id, role_name) VALUES (?, ?)');
          roles.forEach(role => roleStmt.run(userId, role));
          roleStmt.finalize();
        }

        const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'User created successfully', token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, userId: user.id });
  });
});

module.exports = router;
