"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const jobTypeRoutes_1 = __importDefault(require("./jobTypeRoutes"));
const BookingsRoutes_1 = __importDefault(require("./BookingsRoutes"));
const artisanRoutes_1 = __importDefault(require("./artisanRoutes"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_1.default);
router.use("/job-type", jobTypeRoutes_1.default);
router.use("/bookings", BookingsRoutes_1.default);
router.use("/artisan", artisanRoutes_1.default);
exports.default = router;
