import multer from "multer";
import AppError from "../utils/Error.js";
import fs from 'fs'

export const customValdation={
    images:["image/png","img/gif","image/jpeg"]
}
const upload = (validation,folderName) => {
    if(!fs.existsSync(`./uploads/${folderName}`)){
        fs.mkdirSync(`./uploads/${folderName}`)
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype) ) {
            cb(null, true);
        } else {
            cb(new AppError("invalid file formal", 400));
        }
    };
    const upload = multer({ storage, fileFilter });
    return upload;
};
export default upload;
