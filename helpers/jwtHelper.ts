import { sign, verify } from "jsonwebtoken";
interface payload {
  id: string;
  email: string;
}

export async function verifyPayload(token: string) {
  if (!token) {
    throw new Error("Please Enter An Valid Token");
  }
  token = token.replace("Bearer", "").trim();
  return verify(token, process.env.SECRET_KEY!);
}

export async function signToken(payload: payload) {
  return sign(payload, process.env.SECRET_KEY!, { expiresIn: "1w" });
}
