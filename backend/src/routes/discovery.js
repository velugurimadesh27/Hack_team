const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users with optional filtering (optional auth)
router.get('/', (req, res) => {
  const { search = '', role = '', experience = '', skill = '' } = req.query;

  let query = `
    SELECT DISTINCT u.id, u.name, u.university, u.location, u.experience_level, u.bio, u.email, u.github_link
    FROM users u
    LEFT JOIN roles r ON u.id = r.user_id
    LEFT JOIN skills s ON u.id = s.user_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (u.name LIKE ? OR u.bio LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (role) {
    query += ` AND r.role_name = ?`;
    params.push(role);
  }

  if (skill) {
    query += ` AND s.skill_name = ?`;
    params.push(skill);
  }

  if (experience) {
    query += ` AND u.experience_level = ?`;
    params.push(experience);
  }

  query += ` GROUP BY u.id`;

  db.all(query, params, (err, users) => {
    if (err) return res.status(500).json({ error: 'Database error fetching users.', details: err.message });

    // For each user we need to attach their skills and roles to render full profiles on Team Discovery
    // Note: In a production app with thousands of users, doing this iteratively or via JSON aggregation in SQL is better. 
    // Here we will use simple Promise mapping.

    const fetchUserTags = users.map(user => {
      return new Promise((resolve) => {
        db.all('SELECT skill_name FROM skills WHERE user_id = ?', [user.id], (err, skillsRow) => {
          user.skills = skillsRow ? skillsRow.map(s => s.skill_name) : [];
          db.all('SELECT role_name FROM roles WHERE user_id = ?', [user.id], (err, rolesRow) => {
            user.roles = rolesRow ? rolesRow.map(r => r.role_name) : [];
            resolve(user);
          });
        });
      });
    });

    Promise.all(fetchUserTags).then(fullUsers => {
      res.json(fullUsers);
    });
  });
});

module.exports = router;
