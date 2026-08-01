require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : true; // allow all in local dev
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

// 404 Route Handler for unmatched endpoints
app.use((req, res) => {
    res.status(404).json({ message: 'Page / Endpoint Not Found!' });
});

// Global Error Handling Middleware (Wanderlust Style)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({ message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
