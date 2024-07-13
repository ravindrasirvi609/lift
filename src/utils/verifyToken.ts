import { jwtVerify, JWTPayload } from "jose";

interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  isDriver: boolean;
  phoneNumber: string;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Type assertion to ensure all required fields are present
    if (
      !payload.id ||
      typeof payload.id !== "string" ||
      !payload.email ||
      typeof payload.email !== "string" ||
      typeof payload.isDriver !== "boolean"
    ) {
      throw new Error("Invalid token payload");
    }

    return payload as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
}
