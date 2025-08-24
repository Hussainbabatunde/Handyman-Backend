import { Request, Response } from "express";
import { OtpService } from "../services/otpService";
import { Sequelize, where } from "sequelize";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
const {User, JobTypes} = require("../../models"); // adjust path if needed


export const loginController = async (req: Request, res: Response) => {
  try {
  const { phoneNumber, password } = req.body;
  if(!phoneNumber) return res.status(400).json({message: "Phone Number is required."})
  if(!password) return res.status(400).json({message: "Password is required."})
    const userInfo = await User.findOne({
  where: {phoneNumber}
  })

  if(!userInfo) return res.status(404).json({message: "User does not exist."})

    // Compare passwords
    const isMatch = await bcrypt.compare(password, userInfo.password);
    if(!isMatch) return res.status(400).json({message: "Invalid credentials." })

      // Generate access token
    const accessToken = generateToken({
      id: userInfo?.id,
      email: userInfo?.email,
      userType: userInfo?.userType,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        userType: userInfo.userType,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt
      },
    });
    } catch (error: any) {
      console.error("Error login controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, phoneNumber, lastName, firstName, userType, confirmPassword, userJobType } = req.body;
  if(!email) return res.status(400).json({message: "Email is required."})
  if(!password) return res.status(400).json({message: "Password is required."})
  if(!phoneNumber) return res.status(400).json({message: "Phone number is required."})
  if(!lastName) return res.status(400).json({message: "Last name is required."})
  if(!firstName) return res.status(400).json({message: "First name is required."})

    if(password != confirmPassword) return res.status(400).json({message: "Passwords do not match."})
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
      userJobType
    });

      // Generate JWT (only include necessary fields)
    const accessToken = generateToken({
      id: user!.id,
      email: user!.email,
      userType: user!.userType
    });
    
    return res.status(201).json({ message: 'User registered', accessToken, data: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    userType: user.userType,
    userJobType: user.userJobType,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  } });
  } catch (error: any) {
    console.error("Error register controller:", error);
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
    console.error("Error verify phone controller:", err);
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
    console.error("Error resend OTP controller:", err);
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
      if(userInfo){
        return res.status(200).json({
          message: "Validation successful.",
          status: true,
          data: {
        id: userInfo?.id,
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
        email: userInfo?.email,
        phoneNumber: userInfo?.phoneNumber,
        userType: userInfo?.userType,
    createdAt: userInfo?.createdAt,
    updatedAt: userInfo?.updatedAt
      }
        })
      }
    return res.status(200).json({message: "Validation successful.", status: false})
} catch (err) {
    console.error("Error validate phone:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const artisansUserController = async (req: Request, res: Response) => {
  try {
    const { key } = req.params; // search by key
    

    if (!key) {
      return res.status(400).json({ message: "Key is required." });
    }

    // Find job type by key
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
  where: Sequelize.where(
    Sequelize.fn("JSON_CONTAINS", Sequelize.col("userJobType"), JSON.stringify([key])),
    1
  )
});

const jobType = await JobTypes.findOne({
  where: {key}
})

    return res.status(200).json({
      jobType,
      data: users,
    });
  } catch (error: any) {
    console.error("Error update job type controller:", error);
    return res.status(500).json({ message: error.message });
  }
};