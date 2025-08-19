import { Request, Response } from "express";
import { OtpService } from "../services/otpService";
import { where } from "sequelize";
const {User} = require("../../models"); // adjust path if needed


export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Your login logic here
  return res.json({ message: "Login successful", email });
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, phoneNumber, lastName, firstName, userType } = req.body;
    const userInfo = await User.findOne({
      where: {phoneNumber}
    })

    if(userInfo){
      return res.status(400).json({message: "User already exist."})
    }
    // Create the user (password will be hashed by the hook)
    const user = await User.create({
      email,
      password,
      phoneNumber,
      lastName,
      firstName,
      userType,
    });

    return res.status(201).json({ message: 'User registered', userId: user });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyPhoneController = async (req: Request, res: Response) => {
   try {
    // const allUser = await User.findAll()
    // console.log("db: ", allUser);
  const { phoneNo } = req.body;
  if(!phoneNo) return res.status(400).json({message: "Phone number is required."})
  
    const {sessionId, otp} = await OtpService.generateOtp(phoneNo)
    return res.status(200).json({message: "Otp sent successfully", sessionId, otp})
} catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const resendOtpController = async (req: Request, res: Response) => {
   try {
  const { phoneNo, sessionId } = req.body;
  if(!phoneNo) return res.status(400).json({message: "Phone number is required."})
    if(!sessionId) return res.status(400).json({message: "Session ID is required."})
  
    const {otp} = await OtpService.resendOtp(phoneNo, sessionId)
    return res.status(200).json({message: "Otp sent successfully", otp})
} catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const validateOtpController = async (req: Request, res: Response) => {
   try {
  const { phoneNo, sessionId, otp } = req.body;
  if(!phoneNo) return res.status(400).json({message: "Phone number is required."})
    if(!sessionId || !otp) return res.status(400).json({message: "Session ID and OTP is required."})

      const isValid = await OtpService.validateOtp(phoneNo, otp, sessionId)
      if(isValid != true){
        return res.status(400).json({message: isValid})
      }
      const userInfo = await User.findOne({
        where: {phoneNumber: phoneNo}
      })
      console.log("user info: ", userInfo);
      if(userInfo){
        return res.status(200).json({
          message: "Validation successful.",
          status: true,
          data: userInfo
        })
      }
    return res.status(200).json({message: "Validation successful.", status: false})
} catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
