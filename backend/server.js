const express = require('express');
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Serve frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;