const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['apartment', 'commercial', 'house'],
            required: true,
        },
        floors: {
            type: Number,
            min: 0,
        },
        areaSqFt: {
            type: Number,
            min: 0,
        },
        plannedRent: {
            type: Number,
            required: true,
            min: 0,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
