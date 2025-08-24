import { Request, Response } from "express";
import { Op, where } from "sequelize";
const { Bookings, User, JobTypes } = require("../../models"); // adjust path if needed


export const createBookingsController = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { scheduledAt, location, notes, requestedBy, assignedArtisan, jobTypeKey, artisanStatus, status } = req.body;
        if (!scheduledAt) return res.status(400).json({ message: "Working day and Time is required." })
        if (!location) return res.status(400).json({ message: "Location is required." })
        if (!notes) return res.status(400).json({ message: "Notes is required." })
        // if(!requestedBy) return res.status(400).json({message: "Requested by is required."})
        if (!assignedArtisan) return res.status(400).json({ message: "Assigned artisan is required." })
        if (!jobTypeKey) return res.status(400).json({ message: "Job type is required." })

        // Create the job type
        const booking = await Bookings.create({
            scheduledAt,
            location,
            notes,
            requestedBy: user?.id,
            assignedArtisan,
            jobTypeKey,
            artisanStatus: "pending",
            status: "pending"
        });

        const bookingWithUsers = await Bookings.findOne({
      where: { id: booking.id },
      include: [
        { model: User, as: "requester", attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "createdAt"] },
        { model: User, as: "artisan", attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "createdAt"] },
        { model: JobTypes, as: "jobType", attributes: ["id", "name", "description"] },
      ],
    });


        return res.status(201).json({
            message: 'Booking created successfully.', data: {
                booking: bookingWithUsers
            }
        });
    } catch (error: any) {
        console.error("Error create booking controller:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const getAllBookingsController = async (req: Request, res: Response) =>{
    try {
        const user = req.user
        
        const bookings = await Bookings.findAll({
            where: { requestedBy: user?.id },
            include: [
                {model: User, as: "requester", attributes: ["id", "firstName", "lastName", "email"]},
                {model: User, as: "artisan", attributes: ["id", "firstName", "lastName", "email"]},
                { model: JobTypes, as: "jobType", attributes: ["id", "name", "key", "description"] },
            ]
        })

        return res.status(200).json({
            message: "All user bookings.",
            data: bookings
        })
    } catch (error: any) {
        console.error("Error get all bookings controller:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateBookingStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // search by key

    // Find job type by key
    const bookingInfo = await Bookings.findOne({ where: { id } });
    if (!bookingInfo) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Update only fields provided
     bookingInfo.status = "expired";

    await bookingInfo.save();

    return res.status(200).json({
      message: "Booking status updated successfully.",
    });
  } catch (error: any) {
    console.error("Error update booking status controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const completeBookingStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // search by key
    const {artisanId, rating, narration} = req.body;

    // Find job type by key
    const bookingInfo = await Bookings.findOne({ where: { id } });
    if (!bookingInfo) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const userInfo = await User.findOne({ where: { id: artisanId } });
    if (!userInfo) {
      return res.status(404).json({ message: "Artisan cannot be found." });
    }
    console.log("incoming narration: ", narration);
    
    // Update only fields provided
     bookingInfo.status = "accepted";
     bookingInfo.artisanStatus = "completed";
     bookingInfo.completeNarration = narration;

    await bookingInfo.save();
    console.log("Saved booking:", bookingInfo.toJSON());
    let artisanRating
    if(userInfo.stars < 6){
    userInfo.stars = rating;
    artisanRating = rating
    }
    else{
        let divider = Math.ceil(Number(userInfo.stars) / 5)
        let newRating = Number(userInfo.stars) + rating
        let totalRating = newRating / divider;
        userInfo.stars = totalRating;
        artisanRating = totalRating
    }
    await userInfo.save();

    return res.status(200).json({
      message: "Booking completed successfully.",
      artisanRating: artisanRating
    });
  } catch (error: any) {
    console.error("Error completing booking controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const BookingDetailsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // search by key

    // Find job type by key
    const bookingInfo = await Bookings.findOne({ 
        where: { id } ,
        include: [
                {model: User, as: "requester", attributes: ["id", "firstName", "lastName", "email"]},
                {model: User, as: "artisan", attributes: ["id", "firstName", "lastName", "email"]},
                { model: JobTypes, as: "jobType", attributes: ["id", "name", "key", "description"] },
            ]
    });
    if (!bookingInfo) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.status(200).json({
      message: "Booking details.",
      data: bookingInfo
    });
  } catch (error: any) {
    console.error("Error get booking details controller:", error);
    return res.status(500).json({ message: error.message });
  }
};