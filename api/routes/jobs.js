const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Auth Middleware to protect routes
const verifyToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(403).json({ message: 'No token provided' });

    const token = header.split(' ')[1]; // Format: Bearer <token>
    if (!token) return res.status(403).json({ message: 'Invalid token format' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized / Token expired' });
        req.userId = decoded.id;
        next();
    });
};

/**
 * GET /api/jobs (Public endpoint)
 * Returns all active job postings.
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

/**
 * GET /api/jobs/all (Protected)
 * Returns all jobs including inactive, for admin view
 */
router.get('/all', verifyToken, async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

/**
 * POST /api/jobs (Protected endpoint)
 * Create a new job post.
 */
router.post('/', verifyToken, async (req, res) => {
    const { title, location, experience, description, skills_data, is_active } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const activeStatus = is_active !== undefined ? is_active : true;

    try {
        const result = await db.query(
            `INSERT INTO jobs (title, location, experience, description, skills_data, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [title, location || '', experience || '', description, skills_data || null, activeStatus]
        );
        res.status(201).json({ message: 'Job created', jobId: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

/**
 * PUT /api/jobs/:id (Protected endpoint)
 * Update existing job.
 */
router.put('/:id', verifyToken, async (req, res) => {
    const jobId = req.params.id;
    const { title, location, experience, description, skills_data, is_active } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const activeStatus = is_active !== undefined ? is_active : true;

    try {
        const result = await db.query(
            `UPDATE jobs SET title = $1, location = $2, experience = $3, description = $4, skills_data = $5, is_active = $6 WHERE id = $7`,
            [title, location || '', experience || '', description, skills_data || null, activeStatus, jobId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

/**
 * DELETE /api/jobs/:id (Protected endpoint)
 * Delete existing job.
 */
router.delete('/:id', verifyToken, async (req, res) => {
    const jobId = req.params.id;

    try {
        const result = await db.query(`DELETE FROM jobs WHERE id = $1`, [jobId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
