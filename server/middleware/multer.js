const multer = require("multer");
const path = require("path");
const os = require("os");

// store uploads in temp dir
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
