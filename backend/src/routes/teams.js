const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET all teams (public)
router.get('/', (req, res) => {
    const query = `
    SELECT t.id, t.name, t.description, t.hackathon_name, t.max_members, t.looking_for, t.created_at,
           u.name AS owner_name, u.id AS owner_id,
           COUNT(tm.id) AS member_count
    FROM teams t
    JOIN users u ON t.owner_id = u.id
    LEFT JOIN team_members tm ON t.id = tm.team_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `;

    db.all(query, [], (err, teams) => {
        if (err) return res.status(500).json({ error: 'Database error fetching teams.', details: err.message });
        res.json(teams);
    });
});

// GET single team by ID with members
router.get('/:id', (req, res) => {
    const teamId = req.params.id;
    db.get('SELECT t.*, u.name AS owner_name FROM teams t JOIN users u ON t.owner_id = u.id WHERE t.id = ?', [teamId], (err, team) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!team) return res.status(404).json({ error: 'Team not found.' });

        db.all(
            `SELECT u.id, u.name, u.experience_level, u.github_link, tm.status FROM team_members tm 
       JOIN users u ON tm.user_id = u.id WHERE tm.team_id = ?`,
            [teamId],
            (err, members) => {
                if (err) return res.status(500).json({ error: 'Database error fetching members.' });
                res.json({ ...team, members: members || [] });
            }
        );
    });
});

// POST create a new team (requires auth)
router.post('/', authenticateToken, (req, res) => {
    const { name, description, hackathon_name, max_members, looking_for } = req.body;
    const ownerId = req.user.id;

    if (!name) return res.status(400).json({ error: 'Team name is required.' });

    db.run(
        `INSERT INTO teams (name, description, hackathon_name, max_members, looking_for, owner_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, hackathon_name, max_members || 4, looking_for, ownerId],
        function (err) {
            if (err) return res.status(500).json({ error: 'Database error creating team.' });

            const teamId = this.lastID;
            // Auto-add owner as member
            db.run('INSERT INTO team_members (team_id, user_id, status) VALUES (?, ?, ?)', [teamId, ownerId, 'owner'], (err) => {
                if (err) console.error('Error adding owner as member:', err.message);
                res.status(201).json({ message: 'Team created successfully', teamId });
            });
        }
    );
});

// POST join a team (requires auth)
router.post('/:id/join', authenticateToken, (req, res) => {
    const teamId = req.params.id;
    const userId = req.user.id;

    // Check if team exists and has space
    db.get('SELECT t.*, COUNT(tm.id) AS member_count FROM teams t LEFT JOIN team_members tm ON t.id = tm.team_id WHERE t.id = ?', [teamId], (err, team) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!team) return res.status(404).json({ error: 'Team not found.' });
        if (team.member_count >= team.max_members) return res.status(400).json({ error: 'Team is full.' });

        db.run('INSERT OR IGNORE INTO team_members (team_id, user_id, status) VALUES (?, ?, ?)', [teamId, userId, 'member'], function (err) {
            if (err) return res.status(500).json({ error: 'Database error joining team.' });
            if (this.changes === 0) return res.status(400).json({ error: 'You are already a member of this team.' });
            res.json({ message: 'Successfully joined the team!' });
        });
    });
});

// DELETE leave a team (requires auth)
router.delete('/:id/leave', authenticateToken, (req, res) => {
    const teamId = req.params.id;
    const userId = req.user.id;

    db.run('DELETE FROM team_members WHERE team_id = ? AND user_id = ? AND status != ?', [teamId, userId, 'owner'], function (err) {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (this.changes === 0) return res.status(400).json({ error: 'You are not a member or you own this team.' });
        res.json({ message: 'Left the team successfully.' });
    });
});

// DELETE disband a team (only owner)
router.delete('/:id', authenticateToken, (req, res) => {
    const teamId = req.params.id;
    const userId = req.user.id;

    db.get('SELECT * FROM teams WHERE id = ? AND owner_id = ?', [teamId, userId], (err, team) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!team) return res.status(403).json({ error: 'You are not the owner of this team.' });

        db.run('DELETE FROM teams WHERE id = ?', [teamId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error deleting team.' });
            res.json({ message: 'Team disbanded.' });
        });
    });
});

module.exports = router;
