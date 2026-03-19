import jwt from "jsonwebtoken";

export async function requireAuth(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function getUserIdFromRequest(req) {
  const userId = req.user?.userId;

  if (!userId) {
    const error = new Error("User ID not found in request");
    error.statusCode = 401;
    throw error;
  }

  return userId;
}
