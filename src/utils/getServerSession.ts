import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyToken(token);
    return { user: decoded };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
