require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Main Routes (Local)
app.use('/api', authRoutes); // Exposes /api/login
app.use('/api/jobs', jobRoutes); // Exposes /api/jobs for CRUD operations

// Main Routes (Netlify Functions)
app.use('/.netlify/functions/server/api', authRoutes);
app.use('/.netlify/functions/server/api/jobs', jobRoutes);

// Start Server locally if not running in lambda
if (process.env.NETLIFY_DEV !== 'true' && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    app.listen(PORT, () => {
        console.log(`Careers Admin API is running on http://localhost:${PORT}`);
    });
}

// Export the serverless app handler
module.exports.handler = serverless(app);

