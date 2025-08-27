import { Router } from "express";
import { loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";
import { kycController } from "../controllers/artisanKyc";
import { authMiddleware } from "../middlewares/authMiddleware";

const ArtisanRouter = Router();

ArtisanRouter.post("/kyc", authMiddleware, kycController);

export default ArtisanRouter;
