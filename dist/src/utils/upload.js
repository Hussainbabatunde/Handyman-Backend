"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("./cloudinary")); // import configured instance
const fs_1 = __importDefault(require("fs"));
const uploadRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
uploadRouter.post("/", upload.single("file"), async (req, res) => {
    const { name } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("File path:", req.file.path);
        const uploadResult = await cloudinary_1.default.uploader.upload(req.file.path, {
            folder: "my_app_uploads",
        });
        fs_1.default.unlinkSync(req.file.path);
        return res.status(200).json({ url: uploadResult.secure_url, name: name });
    }
    catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Upload failed", details: err.message });
    }
});
exports.default = uploadRouter;
