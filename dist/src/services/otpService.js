"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const redis_1 = __importDefault(require("../../config/redis"));
const uuid_1 = require("uuid");
const sessionId = (0, uuid_1.v4)();
class OtpService {
    static otpTTL = 120;
    static async generateOtp(phone) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await redis_1.default.setEx(`otp:${phone}`, this.otpTTL, JSON.stringify({ sessionId, otp }));
        let sent = { sessionId, otp };
        return sent;
    }
    static async resendOtp(phone, sessionIdSent) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await redis_1.default.setEx(`otp:${phone}`, this.otpTTL, JSON.stringify({ sessionIdSent, otp }));
        let sent = { sessionId, otp };
        return sent;
    }
    static async validateOtp(phone, otp, sessionId) {
        const data = await redis_1.default.get(`otp:${phone}`);
        if (!data) {
            return "No session created.";
        }
        const { sessionId: storedSessionId, otp: storedOtp } = JSON.parse(data);
        if (storedSessionId !== sessionId) {
            return "Invalid session";
        }
        if (storedOtp !== otp) {
            return "Incorrect OTP";
        }
        return true;
    }
    static async deleteOtp(phone) {
        await redis_1.default.del(`otp:${phone}`);
    }
}
exports.OtpService = OtpService;
