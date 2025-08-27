import { Router } from "express";
import { createJobTypeController, getJobTypeController, updateJobTypeController } from "../controllers/jobTypeController";
import { BookingDetailsController, completeBookingStatusController, createBookingsController, getAllArtisanBookingsController, getAllBookingsController, updateBookingStatusController } from "../controllers/bookingsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const BookingsRouter = Router();

BookingsRouter.post("/create", authMiddleware, createBookingsController);
BookingsRouter.get("/client/all", authMiddleware, getAllBookingsController);
BookingsRouter.patch("/update/:id", authMiddleware, updateBookingStatusController);
BookingsRouter.post("/complete/:id", authMiddleware, completeBookingStatusController);
BookingsRouter.get("/details/:id", authMiddleware, BookingDetailsController);
BookingsRouter.get("/artisan/all", authMiddleware, getAllArtisanBookingsController);

export default BookingsRouter;
