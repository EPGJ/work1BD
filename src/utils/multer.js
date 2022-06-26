// const multer = require("multer");
// // const path = require("path");


// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback){
//     const time =  Date.now();
//     callback(null, `${time}_${file.originalname}`)
//   }
// });

// module.exports.storage = storage;

const multer = require("multer");

const multerConfig = () => {

  let allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
  
  return {
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './uploads');
      },
      filename: function (req, file, callback){
        const time =  Date.now();
        callback(null, `${time}_${file.originalname}`)
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) cb(null, true);
      else cb(new Error("Invalid file type."));
    },
  };
};

module.exports.multerConfig = multerConfig;
