import { Router } from "express";
import { artisansUserController, forgotPasswordController, loginController, registerController, resendOtpController, updateUserController, validateOtpController, verifyPhoneController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const AuthRouter = Router();

AuthRouter.post("/login", loginController);
AuthRouter.post("/register", registerController);
AuthRouter.post("/forgot-password", forgotPasswordController);
AuthRouter.post("/verify", verifyPhoneController);
AuthRouter.post("/resend-otp", resendOtpController);
AuthRouter.post("/validate-otp", validateOtpController);
AuthRouter.get("/artisans/:key", authMiddleware, artisansUserController);
AuthRouter.put("/update/:id", authMiddleware, updateUserController);

export default AuthRouter;
