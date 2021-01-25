const path = require("path");
const fs = require("fs");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");

save = (req, res, next) => {
  if (req.body.image) {
    try {
      const filename = uuidv4();
      const base64Data = req.body.image.src.split("base64,")[1];
      image = Buffer.from(base64Data, "base64");
      fs.writeFileSync(
        path.join(process.env.IMAGES_FILEPATH, "images", filename + ".png"),
        image
      );
      req.body.UserDetails["image"] = filename;
    } catch (err) {
      return next(createError(500, "Internal Server Error"));
    }
  }
  next();
};

const fileupload = {
  save: save,
};

module.exports = fileupload;
