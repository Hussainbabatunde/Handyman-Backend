import { Router } from "express";
import AuthRouter from "./authRoutes";
import JobTypesRouter from "./jobTypeRoutes";
import BookingsRouter from "./BookingsRoutes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/job-type", JobTypesRouter);
router.use("/bookings", BookingsRouter);

export default router;