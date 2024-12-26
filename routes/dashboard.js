const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Moment = require('../models/Moment');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.redirect('/auth/login');
        }

        const memories = await Moment.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });

        res.render('dashboard', { 
            user: req.session.user,
            memories: memories
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/auth/login');
    }
});

module.exports = router; 