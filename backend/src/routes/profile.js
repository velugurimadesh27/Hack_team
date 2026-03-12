const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get Profile Menu
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get('SELECT id, name, email, phone, github_link, university, location, bio, experience_level FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error fetching user.' });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Fetch skills
    db.all('SELECT skill_name FROM skills WHERE user_id = ?', [userId], (err, skillsRow) => {
      const skills = skillsRow ? skillsRow.map(s => s.skill_name) : [];
      
      // Fetch roles
      db.all('SELECT role_name FROM roles WHERE user_id = ?', [userId], (err, rolesRow) => {
        const roles = rolesRow ? rolesRow.map(r => r.role_name) : [];
        
        res.json({ ...user, skills, roles });
      });
    });
  });
});

// Update Profile
router.put('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, phone, github_link, university, location, bio, experience_level, skills, roles } = req.body;

  const updateQuery = `
    UPDATE users 
    SET name = ?, phone = ?, github_link = ?, university = ?, location = ?, bio = ?, experience_level = ?
    WHERE id = ?
  `;

  db.run(updateQuery, [name, phone, github_link, university, location, bio, experience_level, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error updating user.' });

    // Update Skills (delete existing and insert new)
    db.run('DELETE FROM skills WHERE user_id = ?', [userId], (err) => {
      if (!err && skills && Array.isArray(skills)) {
        const skillStmt = db.prepare('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)');
        skills.forEach(skill => skillStmt.run(userId, skill));
        skillStmt.finalize();
      }
    });

    // Update Roles
    db.run('DELETE FROM roles WHERE user_id = ?', [userId], (err) => {
      if (!err && roles && Array.isArray(roles)) {
        const roleStmt = db.prepare('INSERT INTO roles (user_id, role_name) VALUES (?, ?)');
        roles.forEach(role => roleStmt.run(userId, role));
        roleStmt.finalize();
      }
    });

    res.json({ message: 'Profile updated successfully' });
  });
});

module.exports = router;
