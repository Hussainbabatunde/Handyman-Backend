"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobTypeController_1 = require("../controllers/jobTypeController");
const JobTypesRouter = (0, express_1.Router)();
JobTypesRouter.post("/create", jobTypeController_1.createJobTypeController);
JobTypesRouter.get("/all", jobTypeController_1.getJobTypeController);
JobTypesRouter.patch("/update/:key", jobTypeController_1.updateJobTypeController);
exports.default = JobTypesRouter;
