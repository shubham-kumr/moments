const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { isAuthenticated } = require('../middleware/auth');
const Moment = require('../models/Moment');
const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();
const upload = multer({ storage: multer.memoryStorage() });

// Format the image data for Cloudinary
const formatBufferTo64 = (file) =>
    parser.format(path.extname(file.originalname).toString(), file.buffer);

router.post('/add', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No image file provided');
        }

        const file64 = formatBufferTo64(req.file);
        const uploadResult = await cloudinary.uploader.upload(file64.content, {
            resource_type: "auto",
            folder: "moments"
        });

        const moment = new Moment({
            userId: req.session.userId,
            title: req.body.title,
            description: req.body.description,
            imageUrl: uploadResult.secure_url
        });

        await moment.save();
        
        res.json({ 
            success: true, 
            moment: moment.toObject() 
        });
    } catch (error) {
        console.error('Add memory error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

router.get('/user', isAuthenticated, async (req, res) => {
    try {
        const memories = await Moment.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });
        res.json(memories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 