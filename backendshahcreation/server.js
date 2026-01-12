import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import clothesRoutes from "./src/routes/clothes.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js"; // ADD THIS
import aboutusRoutes from "./src/routes/aboutus.routes.js"; // ADD THIS
import contactRoutes from "./src/routes/contact.routes.js"; // ADD THIS
import productsRoutes from "./src/routes/products.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const adminUrl = process.env.ADMIN_FRONTEND_URL?.trim();
const userUrl = process.env.USER_FRONTEND_URL?.trim();
const extraOrigins = process.env.EXTRA_CORS_ORIGINS
  ? process.env.EXTRA_CORS_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [adminUrl, userUrl, ...extraOrigins].filter(Boolean);

const allowAllOrigins = allowedOrigins.length === 0;

app.use(
  cors({
    origin: function (origin, callback) {
      // Server-to-server / Postman / curl (no Origin header)
      if (!origin) return callback(null, true);

      if (allowAllOrigins) {
        // Fallback: allow everything but log a warning
        console.warn("CORS fallback: allowing origin", origin);
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/clothes", clothesRoutes); // ADD THIS
app.use("/api/orders", ordersRoutes); // ADD THIS
app.use("/api/aboutus", aboutusRoutes); // ADD THIS
app.use("/api/contact", contactRoutes); // ADD THIS
app.use("/api/products", productsRoutes);

app.get("/health", (req, res) => res.json({ status: "OK" }));

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
