import mongoose, { Types } from "mongoose";
import Product from "./Product"; // Ensure the path is correct

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'content is required'],
        trim: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: [true, 'product is required']
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    }
}, {
    timestamps: true
});

// Middleware to update product rating after saving a review
reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

// Middleware to update product rating after removing a review
reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (productId) {
    try {
        const stats = await this.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: '$product',
                    rateCount: { $sum: 1 },
                    rateAvrage: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                rateCount: stats[0].rateCount,
                rateAvrage: stats[0].rateAvrage
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                rateCount: 0,
                rateAvrage: 0
            });
        }
    } catch (error) {
        console.error('Error calculating average rating:', error);
    }
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;