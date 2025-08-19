import { Router } from "express";
import AuthRouter from "./authRoutes";

const router = Router();

router.use("/auth", AuthRouter);

export default router;