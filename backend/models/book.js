const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    isbn: {
        type: String,
        unique: true,
        sparse: true
    },
    publicationYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear() + 1
    },
    publisher: {
        type: String,
        default: ''
    },
    pages: {
        type: Number,
        min: 1
    },
    language: {
        type: String,
        default: 'English'
    },
    coverImage: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileFormat: {
        type: String,
        enum: ['pdf', 'epub', 'mobi', 'txt'],
        default: 'pdf'
    },
    fileSize: {
        type: Number, // in bytes
        min: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    aiEmbedding: {
        type: [Number], // For semantic search
        default: []
    }
}, {
    timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, rating: -1 });
bookSchema.index({ createdAt: -1 });

// Virtual for average rating (if needed)
bookSchema.virtual('averageRating').get(function() {
    return this.ratingCount > 0 ? this.rating / this.ratingCount : 0;
});

module.exports = mongoose.model('Book', bookSchema);