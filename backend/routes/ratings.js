// backend/routes/ratings.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const mongoose = require('mongoose'); // Додано для перевірки ObjectId

// POST /api/ratings - Збереження нової оцінки або оновлення існуючої
router.post('/', async (req, res) => {
    const { eventId, userId, rating } = req.body;

    if (!eventId || !userId || !rating) {
        return res.status(400).json({ message: 'Missing required fields: eventId, userId, and rating' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        // Спробувати знайти існуючу оцінку від цього користувача для цієї події
        let existingRating = await Rating.findOne({ eventId, userId });

        if (existingRating) {
            // Якщо оцінка вже існує, оновлюємо її
            existingRating.rating = rating;
            existingRating.updatedAt = new Date();
            await existingRating.save();
            return res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
        } else {
            // Інакше створюємо нову оцінку
            const newRating = new Rating({ eventId, userId, rating });
            await newRating.save();
            return res.status(201).json({ message: 'Rating saved successfully', rating: newRating });
        }
    } catch (error) {
        console.error('Error saving/updating rating:', error);
        // Обробка унікального індексу, якщо, наприклад, два запити прийшли майже одночасно
        if (error.code === 11000) { // Duplicate key error code for MongoDB
             return res.status(409).json({ message: 'You have already rated this event. Your rating has been updated.' });
        }
        res.status(500).json({ message: 'Server error while saving rating' });
    }
});

// GET /api/ratings/:eventId - Отримання всіх оцінок для події та середньої оцінки
router.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // За замовчуванням 10 відгуків на сторінку

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }

    try {
        const totalRatings = await Rating.countDocuments({ eventId });
        const ratings = await Rating.find({ eventId })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .sort({ createdAt: -1 }); // Сортуємо за датою створення (найновіші спочатку)

        const totalPages = Math.ceil(totalRatings / limit);

        // Розрахунок середньої оцінки
        const aggregationResult = await Rating.aggregate([
            { $match: { eventId: eventId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        let averageRating = 0;
        let numberOfRatings = 0;
        if (aggregationResult.length > 0) {
            averageRating = aggregationResult[0].averageRating;
            numberOfRatings = aggregationResult[0].count;
        }

        res.status(200).json({
            ratings,
            averageRating,
            numberOfRatings,
            currentPage: page,
            totalPages,
            totalRatings
        });

    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Server error while fetching ratings' });
    }
});

// GET /api/ratings/:eventId/:userId - Отримання оцінки конкретного користувача для події
router.get('/:eventId/:userId', async (req, res) => {
    const { eventId, userId } = req.params;

    if (!eventId || !userId) {
        return res.status(400).json({ message: 'Event ID and User ID are required' });
    }

    try {
        const userRating = await Rating.findOne({ eventId, userId });
        if (userRating) {
            res.status(200).json({ rating: userRating.rating });
        } else {
            res.status(404).json({ message: 'User rating not found for this event.' });
        }
    } catch (error) {
        console.error('Error fetching user rating:', error);
        res.status(500).json({ message: 'Server error while fetching user rating' });
    }
});


module.exports = router;