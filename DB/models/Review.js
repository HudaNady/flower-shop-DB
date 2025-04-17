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
        enum: [1, 2, 3, 4, 5]
    }
}, {
    timestamps: true
});

reviewSchema.post('save', async function () {
    console.log('Review saved, calculating average rating...');
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
    console.log('Review removed, recalculating average rating...');
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.statics.calculateAverageRating = async function (productId) {
    console.log('Calculating average rating for product:', productId);
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
        console.log('Updating product with new rating stats:', stats[0]);
        await Product.findByIdAndUpdate(productId, {
            rateCount: stats[0].rateCount,
            rateAvrage: stats[0].rateAvrage
        });
    } else {
        console.log('No reviews found, resetting product rating stats.');
        await Product.findByIdAndUpdate(productId, {
            rateCount: 0,
            rateAvrage: 0
        });
    }
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;