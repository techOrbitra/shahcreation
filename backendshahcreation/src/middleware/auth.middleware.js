import { verifyAccessToken } from "../utils/jwt.utils.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.adminToken; // ✅ READ FROM COOKIE

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== "super_admin") {
    return res
      .status(401)
      .json({ success: false, message: "Super admin access required" });
  }
  next();
};
