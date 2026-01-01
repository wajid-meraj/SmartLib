const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    interests: [{
        type: String
    }],
    readingHistory: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        lastRead: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        isFavorite: {
            type: Boolean,
            default: false
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    preferences: {
        language: {
            type: String,
            default: 'en'
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            recommendations: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toProfileJSON = function() {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        avatar: this.avatar,
        bio: this.bio,
        interests: this.interests,
        role: this.role,
        preferences: this.preferences,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);