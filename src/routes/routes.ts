import { Router } from "express";
import AuthRouter from "./authRoutes";
import JobTypesRouter from "./jobTypeRoutes";
import BookingsRouter from "./BookingsRoutes";
import ArtisanRouter from "./artisanRoutes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/job-type", JobTypesRouter);
router.use("/bookings", BookingsRouter);
router.use("/artisan", ArtisanRouter);

export default router;