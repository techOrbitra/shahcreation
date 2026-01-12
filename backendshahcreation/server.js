import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import clothesRoutes from "./src/routes/clothes.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js";
import aboutusRoutes from "./src/routes/aboutus.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import productsRoutes from "./src/routes/products.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS - Allow custom headers
const adminUrl = process.env.ADMIN_FRONTEND_URL?.trim();
const userUrl = process.env.USER_FRONTEND_URL?.trim();
const extraOrigins = process.env.EXTRA_CORS_ORIGINS
  ? process.env.EXTRA_CORS_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [adminUrl, userUrl, ...extraOrigins].filter(Boolean);

console.log("✅ CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0) {
        console.warn("⚠️ No CORS origins configured, allowing all");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    // ✅ CRITICAL FIX: Allow x-auth-token header
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-auth-token", // ✅ ADD THIS
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Length", "X-Auth-Token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/aboutus", aboutusRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productsRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: Date.now() })
);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
