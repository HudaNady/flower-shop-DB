import mongoose, { Types } from 'mongoose';
import roles from '../../src/types/roles.js';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [20, 'Maximum length is 20 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [20, 'Maximum length is 20 characters']
    },
    email: {
        type: String,
        unique: true, 
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    passwordChanged: {
        type: Date
    },
    code: {
        type: Number
    },
    codeExpires: {
        type: Date
    },
    isVerifiedForReset: {
        type: Boolean,
        default: false
    },
    rol: { 
        type: String,
        enum: Object.values(roles),
        default: roles.user
    },
    wishList: [{
            type: Types.ObjectId,
            ref: 'Product'
    }],
    address: [{
        city: String,
        street: String,
    }],
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;