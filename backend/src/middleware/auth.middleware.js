import jwt from "jsonwebtoken";

export async function requireAuth(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user info to the request object
    console.log("Authenticated user:", req.user); // Debugging log
    return res.json({ message: "Authenticated", user: req.user }); // Send response with user info
    // next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function getUserIdFromRequest(req) {
  const token = req.cookies.authToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id; // Return user ID from the token payload
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
