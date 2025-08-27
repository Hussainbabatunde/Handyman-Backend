import { Request, Response } from "express";
import { OtpService } from "../services/otpService";
import { Sequelize, where } from "sequelize";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
const {User, Kyc} = require("../../models"); // adjust path if needed


export const kycController = async (req: Request, res: Response) => {
  try {
    const { name, document} = req.body;
    const user = req.user


  if(!name) return res.status(400).json({message: "Name is required."})
  if(!document) return res.status(400).json({message: "Document is required."})

    // Create the user (password will be hashed by the hook)
    const kyc = await Kyc.create({
      name,
      userId: user?.id,
      document
    });


    
    return res.status(201).json({ message: 'Kyc submitted successfully.', data: kyc });
  } catch (error: any) {
    console.error("Error kyc controller:", error);
    return res.status(400).json({ message: error.message });
  }
};