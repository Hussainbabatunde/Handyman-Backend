import { Router } from "express";
import { loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";
import { createJobTypeController, getJobTypeController, updateJobTypeController } from "../controllers/jobTypeController";

const JobTypesRouter = Router();

JobTypesRouter.post("/create", createJobTypeController);
JobTypesRouter.get("/all", getJobTypeController);
JobTypesRouter.patch("/update/:key", updateJobTypeController);

export default JobTypesRouter;
