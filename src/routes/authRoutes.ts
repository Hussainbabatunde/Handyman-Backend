import { Router } from "express";
import { loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";

const AuthRouter = Router();

AuthRouter.post("/login", loginController);
AuthRouter.post("/register", registerController);
AuthRouter.post("/verify", verifyPhoneController);
AuthRouter.post("/resend-otp", resendOtpController);
AuthRouter.post("/validate-otp", validateOtpController);

export default AuthRouter;
