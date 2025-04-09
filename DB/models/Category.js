import mongoose, { Types } from "mongoose";

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        unique:[true,'name is unique'],
        minLength:[3,'min length is 3 characters'],
        maxLength:[25,'max length is 25 characters']
    },
    slug:{
        type:String,
        required:[true,'slug is required'],
        lowerCase:true
    },
    image:String,
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'createdBy is required']
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true
})

// // Pre-save middleware to modify the image path before saving
// categorySchema.pre('save', function(next) {
//     if (this.isModified('image') && this.image) {
//         const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
//         this.image = `${baseUrl}/uploads/category/${this.image}`;
//     }
//     next();
// });

// Middleware to modify the image path after document initialization
categorySchema.post('init', (doc) => {
    if (doc.image) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        doc.image = `${baseUrl}/uploads/category/${doc.image}`;
    }
});


const Category=mongoose.model('Category',categorySchema)
export default Category