import { Router } from "express";
import { loginController, registerController, resendOtpController, validateOtpController, verifyPhoneController } from "../controllers/authController";
import { createJobTypeController, deleteJobTypeController, getJobTypeController, updateJobTypeController } from "../controllers/jobTypeController";

const JobTypesRouter = Router();

JobTypesRouter.post("/create", createJobTypeController);
JobTypesRouter.get("/all", getJobTypeController);
JobTypesRouter.patch("/update/:key", updateJobTypeController);
JobTypesRouter.delete("/delete/:id", deleteJobTypeController);

export default JobTypesRouter;
