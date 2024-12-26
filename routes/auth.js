const express = require('express');
const router = express.Router();
const { auth } = require('../config/firebase');

router.get('/login', (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login', { messages: req.flash() });
});

router.post('/verify-token', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new Error('No token provided');
        }

        const decodedToken = await auth.verifyIdToken(token);
        
        // Set session data
        req.session.userId = decodedToken.uid;
        req.session.user = {
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            picture: decodedToken.picture
        };
        
        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Session error' 
                });
            }
            res.json({ success: true });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Invalid authentication' 
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router; 