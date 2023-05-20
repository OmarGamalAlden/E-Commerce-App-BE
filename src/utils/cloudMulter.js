import multer, { diskStorage } from "multer";
import { GlobalError } from "./errorHandling.js";

export const fileTypes = {
  image: ["image/jpeg", "image/gif", "image/png", "image/avif", "image/webp"],
};

export const fileUpload = (fileFilterValidation = []) => {
  const configureStorage = () => {
    const storage = diskStorage({});
    return storage;
  };

  const configureFilter = () => {
    const fileFilter = (req, file, cb) => {
      if (fileFilterValidation.includes(file.mimetype)) {
        return cb(null, true);
      }
      return cb(
        new GlobalError({ message: "In-valid file Format", statusCode: 400 }),
        false
      );
    };
    return fileFilter;
  };

  const multerMiddleWare = multer({
    fileFilter: configureFilter(),
    storage: configureStorage(),
  });
  return multerMiddleWare;
};
