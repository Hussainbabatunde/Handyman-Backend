import { Request, Response } from "express";
import { Op, where } from "sequelize";
const { Bookings, User } = require("../../models"); // adjust path if needed


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


        return res.status(201).json({
            message: 'Booking created successfully.', data: {
                booking
            }
        });
    } catch (error: any) {
        console.error("Error create booking controller:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const getAllBookingsController = async (req: Request, res: Response) =>{
    try {
        const bookings = await Bookings.findAll({
            include: [
                {model: User, as: "requester", attributes: ["id", "firstName", "lastName", "email"]},
                {model: User, as: "artisan", attributes: ["id", "firstName", "lastName", "email"]}
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