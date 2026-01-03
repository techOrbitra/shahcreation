import { db } from "../db/index.js";
import { contactPageSettings, contactInquiries } from "../db/schema/index.js";
import { eq, desc, and, gte, lte, sql, ilike } from "drizzle-orm";

// ==================== CONTACT PAGE SETTINGS ====================

// Get Contact Page Settings (Public)
export const getContactPageSettings = async (req, res) => {
  try {
    const [settings] = await db.select().from(contactPageSettings).limit(1);

    if (!settings) {
      // Return default settings if not found
      return res.status(200).json({
        success: true,
        data: {
          phone: "+91 98765 43210",
          phoneHours: "Mon-Sat 9AM-8PM",
          email: "hello@shahcreation.com",
          address: "123 Fashion Street, Siddhapur, Gujarat",
          workingHours: "Mon-Sat: 9AM - 8PM\nSunday: 10AM - 6PM",
          mapImageUrl:
            "https://images.unsplash.com/photo-1551632811-561732a7d5e0?w=1200&fit=crop",
          googleMapsLink: "",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get contact settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Contact Page Settings (Admin)
export const updateContactPageSettings = async (req, res) => {
  try {
    const {
      phone,
      phoneHours,
      email,
      address,
      workingHours,
      mapImageUrl,
      googleMapsLink,
    } = req.body;

    // Check if settings exist
    const [existing] = await db.select().from(contactPageSettings).limit(1);

    const updateData = { updatedAt: new Date() };
    if (phone) updateData.phone = phone;
    if (phoneHours) updateData.phoneHours = phoneHours;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (workingHours) updateData.workingHours = workingHours;
    if (mapImageUrl !== undefined) updateData.mapImageUrl = mapImageUrl;
    if (googleMapsLink !== undefined)
      updateData.googleMapsLink = googleMapsLink;

    let updatedSettings;

    if (existing) {
      // Update existing
      [updatedSettings] = await db
        .update(contactPageSettings)
        .set(updateData)
        .where(eq(contactPageSettings.id, existing.id))
        .returning();
    } else {
      // Create new (first time)
      [updatedSettings] = await db
        .insert(contactPageSettings)
        .values(updateData)
        .returning();
    }

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: "Contact settings updated successfully",
    });
  } catch (error) {
    console.error("Update contact settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Phone Details (Admin)
export const updatePhoneDetails = async (req, res) => {
  try {
    const { phone, phoneHours } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number required" });
    }

    const [existing] = await db.select().from(contactPageSettings).limit(1);

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Contact settings not initialized" });
    }

    const [updatedSettings] = await db
      .update(contactPageSettings)
      .set({
        phone,
        phoneHours: phoneHours || existing.phoneHours,
        updatedAt: new Date(),
      })
      .where(eq(contactPageSettings.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: "Phone details updated successfully",
    });
  } catch (error) {
    console.error("Update phone error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Address (Admin)
export const updateAddress = async (req, res) => {
  try {
    const { address, workingHours } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address required" });
    }

    const [existing] = await db.select().from(contactPageSettings).limit(1);

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Contact settings not initialized" });
    }

    const [updatedSettings] = await db
      .update(contactPageSettings)
      .set({
        address,
        workingHours: workingHours || existing.workingHours,
        updatedAt: new Date(),
      })
      .where(eq(contactPageSettings.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reset Contact Settings to Default (Admin)
export const resetContactSettings = async (req, res) => {
  try {
    const defaultSettings = {
      phone: "+91 98765 43210",
      phoneHours: "Mon-Sat 9AM-8PM",
      email: "hello@shahcreation.com",
      address: "123 Fashion Street, Siddhapur, Gujarat",
      workingHours: "Mon-Sat: 9AM - 8PM\nSunday: 10AM - 6PM",
      mapImageUrl:
        "https://images.unsplash.com/photo-1551632811-561732a7d5e0?w=1200&fit=crop",
      googleMapsLink: "",
      updatedAt: new Date(),
    };

    const [existing] = await db.select().from(contactPageSettings).limit(1);

    let resetSettings;

    if (existing) {
      [resetSettings] = await db
        .update(contactPageSettings)
        .set(defaultSettings)
        .where(eq(contactPageSettings.id, existing.id))
        .returning();
    } else {
      [resetSettings] = await db
        .insert(contactPageSettings)
        .values(defaultSettings)
        .returning();
    }

    res.status(200).json({
      success: true,
      data: resetSettings,
      message: "Contact settings reset to default successfully",
    });
  } catch (error) {
    console.error("Reset contact settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== CONTACT INQUIRIES ====================

// Get All Contact Inquiries with Pagination & Filters (Admin)
export const getAllInquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      isRead = "",
      startDate = "",
      endDate = "",
      sort = "newest",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];

    // Search filter (name, email, phone, message)
    if (search) {
      conditions.push(
        sql`(${contactInquiries.name} ILIKE ${`%${search}%`} OR ${
          contactInquiries.email
        } ILIKE ${`%${search}%`} OR ${
          contactInquiries.phone
        } ILIKE ${`%${search}%`} OR ${
          contactInquiries.message
        } ILIKE ${`%${search}%`})`
      );
    }

    // Read status filter
    if (isRead === "true") {
      conditions.push(eq(contactInquiries.isRead, true));
    } else if (isRead === "false") {
      conditions.push(eq(contactInquiries.isRead, false));
    }

    // Date range filter
    if (startDate) {
      conditions.push(gte(contactInquiries.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(contactInquiries.createdAt, end));
    }

    // Sorting
    let orderBy;
    switch (sort) {
      case "oldest":
        orderBy = contactInquiries.createdAt;
        break;
      case "name-asc":
        orderBy = contactInquiries.name;
        break;
      case "name-desc":
        orderBy = desc(contactInquiries.name);
        break;
      case "newest":
      default:
        orderBy = desc(contactInquiries.createdAt);
        break;
    }

    // Get total count
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(contactInquiries)
      .where(whereClause);

    // Get paginated results
    const inquiries = await db
      .select()
      .from(contactInquiries)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(Number(limit))
      .offset(offset);

    // Get unread count
    const [{ unreadCount }] = await db
      .select({ unreadCount: sql`count(*)` })
      .from(contactInquiries)
      .where(eq(contactInquiries.isRead, false));

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        pages: Math.ceil(Number(count) / Number(limit)),
      },
      unreadCount: Number(unreadCount),
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Inquiry (Admin)
export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [inquiry] = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.id, Number(id)))
      .limit(1);

    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    console.error("Get inquiry error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create Contact Inquiry (Public - from contact form)
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and message are required",
      });
    }

    // Create inquiry
    const [newInquiry] = await db
      .insert(contactInquiries)
      .values({
        name,
        email: email || null,
        phone,
        message,
        isRead: false,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newInquiry,
      message:
        "Your inquiry has been submitted successfully. We will contact you soon!",
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark Inquiry as Read/Unread (Admin)
export const toggleInquiryReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (isRead === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "isRead status required" });
    }

    const [updatedInquiry] = await db
      .update(contactInquiries)
      .set({ isRead })
      .where(eq(contactInquiries.id, Number(id)))
      .returning();

    if (!updatedInquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedInquiry,
      message: `Inquiry marked as ${isRead ? "read" : "unread"}`,
    });
  } catch (error) {
    console.error("Toggle read status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Bulk Mark as Read (Admin)
export const bulkMarkAsRead = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Inquiry IDs array required" });
    }

    for (const id of ids) {
      await db
        .update(contactInquiries)
        .set({ isRead: true })
        .where(eq(contactInquiries.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} inquiries marked as read`,
    });
  } catch (error) {
    console.error("Bulk mark read error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Inquiry (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [inquiry] = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.id, Number(id)))
      .limit(1);

    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    await db
      .delete(contactInquiries)
      .where(eq(contactInquiries.id, Number(id)));

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Bulk Delete Inquiries (Admin)
export const bulkDeleteInquiries = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Inquiry IDs array required" });
    }

    for (const id of ids) {
      await db
        .delete(contactInquiries)
        .where(eq(contactInquiries.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} inquiries deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Inquiry Statistics (Admin Dashboard)
export const getInquiryStats = async (req, res) => {
  try {
    const { startDate = "", endDate = "" } = req.query;
    const conditions = [];

    if (startDate) {
      conditions.push(gte(contactInquiries.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(contactInquiries.createdAt, end));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total inquiries
    const [{ totalInquiries }] = await db
      .select({ totalInquiries: sql`count(*)` })
      .from(contactInquiries)
      .where(whereClause);

    // Unread inquiries
    const [{ unreadInquiries }] = await db
      .select({ unreadInquiries: sql`count(*)` })
      .from(contactInquiries)
      .where(and(whereClause, eq(contactInquiries.isRead, false)));

    // Read inquiries
    const [{ readInquiries }] = await db
      .select({ readInquiries: sql`count(*)` })
      .from(contactInquiries)
      .where(and(whereClause, eq(contactInquiries.isRead, true)));

    // Recent inquiries
    const recentInquiries = await db
      .select({
        id: contactInquiries.id,
        name: contactInquiries.name,
        phone: contactInquiries.phone,
        message: contactInquiries.message,
        isRead: contactInquiries.isRead,
        createdAt: contactInquiries.createdAt,
      })
      .from(contactInquiries)
      .where(whereClause)
      .orderBy(desc(contactInquiries.createdAt))
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalInquiries: Number(totalInquiries),
        unreadInquiries: Number(unreadInquiries),
        readInquiries: Number(readInquiries),
        recentInquiries,
      },
    });
  } catch (error) {
    console.error("Get inquiry stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export Inquiries (Admin)
export const exportInquiries = async (req, res) => {
  try {
    const { startDate = "", endDate = "", isRead = "" } = req.query;
    const conditions = [];

    if (startDate)
      conditions.push(gte(contactInquiries.createdAt, new Date(startDate)));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(contactInquiries.createdAt, end));
    }
    if (isRead === "true") conditions.push(eq(contactInquiries.isRead, true));
    if (isRead === "false") conditions.push(eq(contactInquiries.isRead, false));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allInquiries = await db
      .select()
      .from(contactInquiries)
      .where(whereClause)
      .orderBy(desc(contactInquiries.createdAt));

    // Format for CSV export
    const exportData = allInquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email || "",
      phone: inquiry.phone,
      message: inquiry.message,
      isRead: inquiry.isRead ? "Yes" : "No",
      createdAt: inquiry.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: exportData,
      count: exportData.length,
    });
  } catch (error) {
    console.error("Export inquiries error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
