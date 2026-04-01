const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['danger', 'prohibitory', 'mandatory', 'other'],
        default: 'other'
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    source: {
        type: String,
        default: 'Camera 0'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        fps: Number,
        resolution: String,
        modelVersion: String
    }
}, {
    timestamps: true
});

// Index for faster queries
detectionSchema.index({ timestamp: -1 });
detectionSchema.index({ category: 1 });

module.exports = mongoose.model('Detection', detectionSchema);
