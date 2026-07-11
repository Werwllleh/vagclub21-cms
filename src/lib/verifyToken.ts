import {jwtVerify} from "jose";
import {PayloadRequest} from "payload";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET!,
);

export const verifyToken = async (token: string) => {
  try {
    const {payload} = await jwtVerify(
      token,
      secretKey,
    );

    return payload;
  } catch {
    throw new Error('Invalid token');
  }
};

export const getCookieValue = (
  req: PayloadRequest,
  cookieName: string,
): string | null => {
  const cookieHeader = req.headers.get('cookie');

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split('=');

    if (name === cookieName) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return null;
};
