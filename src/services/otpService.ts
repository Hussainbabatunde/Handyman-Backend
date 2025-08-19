import redisClient from "../../config/redis";
import { v4 as uuidv4 } from "uuid";

const sessionId = uuidv4();

export class OtpService {
    private static otpTTL = 120;

    static async generateOtp(phone: string): Promise<{ sessionId: string; otp: string }> {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await redisClient.setEx(`otp:${phone}`, this.otpTTL, JSON.stringify({ sessionId, otp }))
        let sent = {sessionId, otp}
        return sent
    }

    static async resendOtp(phone: string, sessionIdSent: string): Promise<{ otp: string }> {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await redisClient.setEx(`otp:${phone}`, this.otpTTL, JSON.stringify({ sessionIdSent, otp }))
        let sent = {sessionId, otp}
        return sent
    }

    static async validateOtp(phone: string, otp: string, sessionId: string): Promise<boolean | string> {
        const data = await redisClient.get(`otp:${phone}`);
        if(!data){
            return "No session created."
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

    static async deleteOtp(phone: string): Promise<void> {
        await redisClient.del(`otp:${phone}`);
    }
}