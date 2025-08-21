import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // use env variable in production
const JWT_EXPIRES_IN = "30d"; // 1 hour token

export const generateToken = (payload: object) =>{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify (decrypt) token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return false
  }
};