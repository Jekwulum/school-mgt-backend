const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');

const connection = mongoose.connect("mongodb://localhost:27017/test");
const storage = new GridFsStorage({
    url: connection,
    file: (req, res) => {
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedFileTypes.includes(file.mimetype)) {
            return {
                bucketName: 'photos'
            };
        } else {
            return null
        }
    }
});

const upload = multer({ storage })