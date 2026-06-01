const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dramaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drama',       
        required: true
    },
    dramaTitle: {
        type: String,
        required: true          
    },
    dramaPoster: {
        type: String,
        required: true          
    },
    status:{
        type: String,
        enum: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    reviewText: {
        type: String,       
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now           
        }
});

module.exports = mongoose.model('Review', reviewSchema);