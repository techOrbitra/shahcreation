import { db } from "../db/index.js";
import { admins } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword } from "../utils/password.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (!admin || !admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const payload = { id: admin.id, email: admin.email, role: admin.role };
    const accessToken = generateAccessToken(payload);

    // ✅ SET HTTP-ONLY COOKIE (server-side only)
    res.cookie("adminToken", accessToken, {
      // httpOnly: true,
      // // secure: process.env.NODE_ENV === "production",
      // // sameSite: "strict",
      // secure: false,
      // sameSite: "lax",
      // maxAge: 24 * 60 * 60 * 1000, // 24h
      httpOnly: true,
      secure: true, // 🔒 REQUIRED (HTTPS only)
      sameSite: "none", // 🌍 REQUIRED (cross-domain)
      path: "/", // 📌 IMPORTANT
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      success: true,
      data: { admin },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, req.admin.id))
      .limit(1);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get current admin profile
// export const getCurrentAdmin = async (req, res) => {
//   try {
//     const adminId = req.admin.id;

//     // Fetch full admin details from database
//     const [admin] = await db
//       .select({
//         id: admins.id,
//         email: admins.email,
//         name: admins.name,
//         role: admins.role,
//         isActive: admins.isActive,
//         createdAt: admins.createdAt,
//       })
//       .from(admins)
//       .where(eq(admins.id, adminId))
//       .limit(1);

//     if (!admin) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Admin not found" });
//     }

//     if (!admin.isActive) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Account is inactive" });
//     }

//     res.status(200).json({
//       success: true,
//       data: admin,
//     });
//   } catch (error) {
//     console.error("Get current admin error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };\

export const getCurrentAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const [admin] = await db
      .select({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        role: admins.role,
        isActive: admins.isActive,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get current admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token (your JWT logic)
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const payload = { id: decoded.id, email: decoded.email };

    const newAccessToken = generateAccessToken(payload);

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};
