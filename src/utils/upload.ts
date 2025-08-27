import { Router } from "express";
import multer from "multer";
import cloudinary from "./cloudinary"; // import configured instance
import fs from "fs";

const uploadRouter = Router();
const upload = multer({ dest: "uploads/" });

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    const {name} = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File path:", req.file.path);

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "my_app_uploads",
    });

    fs.unlinkSync(req.file.path);

    return res.status(200).json({ url: uploadResult.secure_url, name: name });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default uploadRouter;
