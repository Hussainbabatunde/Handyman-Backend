import { Router } from "express";
import { artisansUserController, loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const AuthRouter = Router();

AuthRouter.post("/login", loginController);
AuthRouter.post("/register", registerController);
AuthRouter.post("/verify", verifyPhoneController);
AuthRouter.post("/resend-otp", resendOtpController);
AuthRouter.post("/validate-otp", validateOtpController);
AuthRouter.get("/artisans/:key", authMiddleware, artisansUserController);

export default AuthRouter;
