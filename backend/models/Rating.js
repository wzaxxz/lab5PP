const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Додаємо індекс, щоб уникнути дублювання оцінок від одного користувача для однієї події
RatingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);