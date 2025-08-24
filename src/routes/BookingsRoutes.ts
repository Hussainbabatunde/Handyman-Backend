import { Router } from "express";
import { createJobTypeController, getJobTypeController, updateJobTypeController } from "../controllers/jobTypeController";
import { createBookingsController, getAllBookingsController } from "../controllers/bookingsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const BookingsRouter = Router();

BookingsRouter.post("/create", authMiddleware, createBookingsController);
BookingsRouter.get("/client/all", authMiddleware, getAllBookingsController);

export default BookingsRouter;
