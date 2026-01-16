import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-min-32-characters-long-for-jwt"
);
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const jwtUtils = {
  sign: async (payload: TokenPayload): Promise<string> => {
    const jwt = await new jose.SignJWT(payload as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);
    return jwt;
  },

  verify: async (token: string): Promise<TokenPayload | null> => {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      return payload as unknown as TokenPayload;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  },

  decode: (token: string): TokenPayload | null => {
    try {
      const decoded = jose.decodeJwt(token);
      return decoded as unknown as TokenPayload;
    } catch {
      return null;
    }
  },
};
