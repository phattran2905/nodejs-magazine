const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch (file.fieldname) {
            case 'thumbnail_img':
                cb(null,'uploaded_files/thumbnail_img');
                break;
            case 'avatar_img':
                cb(null,'uploaded_files/avatar_img');
                break;
            default:
                cb(null,'uploaded_files/uploads/')
                break;
        }
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.substr(6,);
        switch (file.fieldname) {
            case 'thumbnail_img':
                cb(null, req.user._id + '-' + Date.now() + '.' + extension);
                break;
            case 'avatar_img':
                cb(null, req.user._id + '-' + Date.now() + '.'  + extension);
                break;
            default:
                cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
                break;
        }
    }
  });

const uploadSetup = {
    storage: storage ,
    filter_files: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg' ||  file.mimetype !== 'image/png' ){
            return cb(null,false);
        }
    },
    limits: {
        fileSize: 2048000
    }
}
const upload = multer(uploadSetup);
module.exports = upload;