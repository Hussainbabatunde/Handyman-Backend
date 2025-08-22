import { Router } from "express";
import AuthRouter from "./authRoutes";
import JobTypesRouter from "./jobTypeRoutes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/job-type", JobTypesRouter);

export default router;