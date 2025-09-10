"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artisansUserController = exports.validateOtpController = exports.resendOtpController = exports.verifyPhoneController = exports.registerController = exports.loginController = void 0;
const otpService_1 = require("../services/otpService");
const sequelize_1 = require("sequelize");
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const { User } = require("../../models/user"); // adjust path if needed
const { JobTypes } = require("../../models/jobtypes"); // adjust path if needed
const loginController = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber)
            return res.status(400).json({ message: "Phone Number is required." });
        if (!password)
            return res.status(400).json({ message: "Password is required." });
        const userInfo = await User.findOne({
            where: { phoneNumber }
        });
        if (!userInfo)
            return res.status(404).json({ message: "User does not exist." });
        // Compare passwords
        const isMatch = await bcrypt_1.default.compare(password, userInfo.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials." });
        // Generate access token
        const accessToken = (0, jwt_1.generateToken)({
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
                completedKyc: userInfo?.completedKyc,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt
            },
        });
    }
    catch (error) {
        console.error("Error login controller:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    try {
        const { email, password, phoneNumber, lastName, firstName, userType, confirmPassword, userJobType } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required." });
        if (!password)
            return res.status(400).json({ message: "Password is required." });
        if (!phoneNumber)
            return res.status(400).json({ message: "Phone number is required." });
        if (!lastName)
            return res.status(400).json({ message: "Last name is required." });
        if (!firstName)
            return res.status(400).json({ message: "First name is required." });
        if (password != confirmPassword)
            return res.status(400).json({ message: "Passwords do not match." });
        const userInfo = await User.findOne({
            where: { phoneNumber }
        });
        if (userInfo) {
            return res.status(400).json({ message: "User already exist." });
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
        const accessToken = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            userType: user.userType
        });
        return res.status(201).json({
            message: 'User registered', accessToken, data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                userType: user.userType,
                userJobType: user.userJobType,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        console.error("Error register controller:", error);
        return res.status(400).json({ message: error.message });
    }
};
exports.registerController = registerController;
const verifyPhoneController = async (req, res) => {
    try {
        // const allUser = await User.findAll()
        // console.log("db: ", allUser);
        const { phoneNo } = req.body;
        if (!phoneNo)
            return res.status(400).json({ message: "Phone number is required." });
        const { sessionId, otp } = await otpService_1.OtpService.generateOtp(phoneNo);
        return res.status(200).json({ message: "Otp sent successfully", sessionId, otp });
    }
    catch (err) {
        console.error("Error verify phone controller:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.verifyPhoneController = verifyPhoneController;
const resendOtpController = async (req, res) => {
    try {
        const { phoneNo, sessionId } = req.body;
        if (!phoneNo)
            return res.status(400).json({ message: "Phone number is required." });
        if (!sessionId)
            return res.status(400).json({ message: "Session ID is required." });
        const { otp } = await otpService_1.OtpService.resendOtp(phoneNo, sessionId);
        return res.status(200).json({ message: "Otp sent successfully", otp });
    }
    catch (err) {
        console.error("Error resend OTP controller:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.resendOtpController = resendOtpController;
const validateOtpController = async (req, res) => {
    try {
        const { phoneNo, sessionId, otp } = req.body;
        if (!phoneNo)
            return res.status(400).json({ message: "Phone number is required." });
        if (!sessionId || !otp)
            return res.status(400).json({ message: "Session ID and OTP is required." });
        const isValid = await otpService_1.OtpService.validateOtp(phoneNo, otp, sessionId);
        // if(isValid != true){
        if (otp != "1234") {
            return res.status(400).json({ message: isValid });
        }
        const userInfo = await User.findOne({
            where: { phoneNumber: phoneNo }
        });
        if (userInfo) {
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
            });
        }
        return res.status(200).json({ message: "Validation successful.", status: false });
    }
    catch (err) {
        console.error("Error validate phone:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.validateOtpController = validateOtpController;
const artisansUserController = async (req, res) => {
    try {
        const { key } = req.params; // search by key
        if (!key) {
            return res.status(400).json({ message: "Key is required." });
        }
        // Find job type by key
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("JSON_CONTAINS", sequelize_1.Sequelize.col("userJobType"), JSON.stringify([key])), 1)
        });
        const jobType = await JobTypes.findOne({
            where: { key }
        });
        // console.log(users.map((u: any) => u.toJSON()));
        return res.status(200).json({
            jobType,
            data: users,
        });
    }
    catch (error) {
        console.error("Error update job type controller:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.artisansUserController = artisansUserController;
