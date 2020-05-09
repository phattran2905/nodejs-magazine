const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch (file.fieldname) {
            case 'thumbnail_img':
                cb(null,'tmp/thumbnail_img');
                break;
            case 'profile_img':
                cb(null,'tmp/profile_img');
                break;
            default:
                cb(null,'tmp/uploads/')
                break;
        }
    },
    filename: function (req, file, cb) {
        switch (file.fieldname) {
            case 'thumbnail_img':
                cb(null, req.user.id + '-' + Date.now());
                break;
            case 'profile_img':
                cb(null, req.user.id + '-' + Date.now());
                break;
            default:
                cb(null, file.fieldname + '-' + Date.now())
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