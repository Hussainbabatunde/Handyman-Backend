import { Router } from "express";
import { loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";

const ArtisanRouter = Router();

ArtisanRouter.post("/login", loginController);

export default ArtisanRouter;
