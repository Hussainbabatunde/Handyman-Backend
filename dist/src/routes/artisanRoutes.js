"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artisanKyc_1 = require("../controllers/artisanKyc");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ArtisanRouter = (0, express_1.Router)();
ArtisanRouter.post("/kyc", authMiddleware_1.authMiddleware, artisanKyc_1.kycController);
exports.default = ArtisanRouter;
