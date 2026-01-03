import { db } from "../db/index.js";
import { orders } from "../db/schema/index.js";
import { eq, ilike, and, gte, lte, desc, asc, sql, or } from "drizzle-orm";

// Get all orders with pagination & filters (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      startDate = "",
      endDate = "",
      minAmount = "",
      maxAmount = "",
      sort = "newest",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];

    // Search filter (customer name, phone, whatsapp)
    if (search) {
      conditions.push(
        sql`(${orders.customerName} ILIKE ${`%${search}%`} OR ${
          orders.customerPhone
        } ILIKE ${`%${search}%`} OR ${
          orders.customerWhatsapp
        } ILIKE ${`%${search}%`})`
      );
    }

    // Status filter
    if (status) {
      conditions.push(eq(orders.status, status));
    }

    // Date range filter
    if (startDate) {
      conditions.push(gte(orders.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(orders.createdAt, end));
    }

    // Amount range filter
    if (minAmount) {
      conditions.push(gte(orders.totalAmount, Number(minAmount)));
    }
    if (maxAmount) {
      conditions.push(lte(orders.totalAmount, Number(maxAmount)));
    }

    // Sorting
    let orderBy;
    switch (sort) {
      case "oldest":
        orderBy = asc(orders.createdAt);
        break;
      case "amount-asc":
        orderBy = asc(orders.totalAmount);
        break;
      case "amount-desc":
        orderBy = desc(orders.totalAmount);
        break;
      case "name-asc":
        orderBy = asc(orders.customerName);
        break;
      case "name-desc":
        orderBy = desc(orders.customerName);
        break;
      case "newest":
      default:
        orderBy = desc(orders.createdAt);
        break;
    }

    // Get total count
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(orders)
      .where(whereClause);

    // Get paginated results
    const allOrders = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(Number(limit))
      .offset(offset);

    res.status(200).json({
      success: true,
      data: allOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        pages: Math.ceil(Number(count) / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single order by ID (Admin)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, Number(id)))
      .limit(1);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create order (Public - from frontend cart)
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      customerAddress,
      items,
      totalAmount,
    } = req.body;

    // Validation
    if (!customerName || !customerPhone || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone, items, and total amount are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate items structure
    const validItems = items.every(
      (item) =>
        item.id && item.name && item.quantity && item.price && item.image
    );

    if (!validItems) {
      return res.status(400).json({
        success: false,
        message: "Invalid item structure",
      });
    }

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName,
        customerPhone,
        customerWhatsapp: customerWhatsapp || null,
        customerAddress: customerAddress || null,
        items,
        totalAmount: Number(totalAmount),
        status: "pending",
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
      });
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order details (Admin)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      customerAddress,
      items,
      totalAmount,
      notes,
    } = req.body;

    const updateData = { updatedAt: new Date() };
    if (customerName) updateData.customerName = customerName;
    if (customerPhone) updateData.customerPhone = customerPhone;
    if (customerWhatsapp !== undefined)
      updateData.customerWhatsapp = customerWhatsapp;
    if (customerAddress !== undefined)
      updateData.customerAddress = customerAddress;
    if (items) updateData.items = items;
    if (totalAmount) updateData.totalAmount = Number(totalAmount);
    if (notes !== undefined) updateData.notes = notes;

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add notes to order (Admin)
export const addOrderNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes) {
      return res
        .status(400)
        .json({ success: false, message: "Notes are required" });
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ notes, updatedAt: new Date() })
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Notes added successfully",
    });
  } catch (error) {
    console.error("Add notes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, Number(id)))
      .limit(1);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await db.delete(orders).where(eq(orders.id, Number(id)));

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Bulk delete orders (Admin)
export const bulkDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order IDs array required" });
    }

    for (const id of ids) {
      await db.delete(orders).where(eq(orders.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} orders deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Bulk update order status (Admin)
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order IDs array required" });
    }

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
      });
    }

    for (const id of ids) {
      await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(orders.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} orders updated to ${status}`,
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get order statistics (Admin Dashboard)
export const getOrderStats = async (req, res) => {
  try {
    const { startDate = "", endDate = "" } = req.query;
    const conditions = [];

    if (startDate) {
      conditions.push(gte(orders.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(orders.createdAt, end));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total orders
    const [{ totalOrders }] = await db
      .select({ totalOrders: sql`count(*)` })
      .from(orders)
      .where(whereClause);

    // Total revenue
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql`COALESCE(sum(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(whereClause);

    // Orders by status
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: sql`count(*)`,
        total: sql`sum(${orders.totalAmount})`,
      })
      .from(orders)
      .where(whereClause)
      .groupBy(orders.status);

    // Recent orders
    const recentOrders = await db
      .select({
        id: orders.id,
        customerName: orders.customerName,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: Number(totalOrders),
        totalRevenue: Number(totalRevenue),
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get orders by customer phone (Public - for customer to track)
export const getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number required" });
    }

    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerPhone, phone))
      .orderBy(desc(orders.createdAt));

    res.status(200).json({
      success: true,
      data: customerOrders,
      count: customerOrders.length,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export orders to CSV data (Admin)
export const exportOrders = async (req, res) => {
  try {
    const { startDate = "", endDate = "", status = "" } = req.query;
    const conditions = [];

    if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate)));
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(orders.createdAt, end));
    }
    if (status) conditions.push(eq(orders.status, status));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allOrders = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt));

    // Format for CSV export
    const exportData = allOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerWhatsapp: order.customerWhatsapp || "",
      customerAddress: order.customerAddress || "",
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      notes: order.notes || "",
    }));

    res.status(200).json({
      success: true,
      data: exportData,
      count: exportData.length,
    });
  } catch (error) {
    console.error("Export orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
