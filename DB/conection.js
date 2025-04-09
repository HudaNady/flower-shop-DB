import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const uri = process.env.MONGODB_URI ; 
console.log('MongoDB URI:', uri);
const connected=()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log('DB connected')
    }).catch((err)=>{
        console.log('DB failed')
        console.log(err)
    })
}

export default connected
