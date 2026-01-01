const express = require('express');
const router = express.Router();

// In a real application, you would use a database and proper authentication
const users = [];

// POST /api/auth/register - User registration
router.post('/register', (req, res) => {
    const { fullName, email, password } = req.body;
    
    // Validation
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'User already exists with this email'
        });
    }
    
    // In a real application, you would hash the password
    const newUser = {
        id: users.length + 1,
        fullName,
        email,
        password, // In real app, this would be hashed
        createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email
        }
    });
});

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    
    // In a real application, you would generate a JWT token
    const token = 'simulated-jwt-token-' + user.id;
    
    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        }
    });
});

module.exports = router;