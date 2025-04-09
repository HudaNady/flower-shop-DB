import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = async (imagePath, type) => {
    const fullImagePath = path.join(__dirname, '../../', 'uploads', type, imagePath);

    return new Promise((resolve, reject) => {
        fs.access(fullImagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`Image file not found: ${fullImagePath}`);
                resolve();
            } else {
                fs.unlink(fullImagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting image file: ${unlinkErr}`);
                        reject(unlinkErr);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

export default deleteImageFile;


