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

const adminFrontend = process.env.ADMIN_FRONTEND_URL?.replace(/\/$/, ""); // Remove trailing slash
const userFrontend = process.env.USER_FRONTEND_URL?.replace(/\/$/, "");
const extraOrigins = process.env.EXTRA_CORS_ORIGINS
  ? process.env.EXTRA_CORS_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [adminFrontend, userFrontend, ...extraOrigins].filter(
  Boolean
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl)
      if (!origin) return callback(null, true);

      // Allow exact matches only
      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS Allowed:", origin);
        return callback(null, true);
      }

      console.log("❌ CORS Blocked:", origin);
      return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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
