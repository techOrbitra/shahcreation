import { db } from "../db/index.js";
import { admins } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/password.utils.js";

export const getAllAdmins = async (req, res) => {
  try {
    const allAdmins = await db
      .select({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        role: admins.role,
        isActive: admins.isActive,
        createdAt: admins.createdAt,
      })
      .from(admins);

    res.status(200).json({ success: true, data: allAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const hashedPassword = await hashPassword(password);

    const [newAdmin] = await db
      .insert(admins)
      .values({
        email,
        password: hashedPassword,
        name,
        role: role || "admin",
        createdBy: req.admin.id,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.admin.id) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete yourself" });
    }

    await db.delete(admins).where(eq(admins.id, Number(id)));

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    await db
      .update(admins)
      .set({ isActive })
      .where(eq(admins.id, Number(id)));

    res.status(200).json({ success: true, message: "Admin status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
