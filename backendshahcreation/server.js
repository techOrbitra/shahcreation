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

const allowedOrigins = [
  process.env.CLIENT_URL, // e.g. http://localhost:3000
  "https://shahcreation-1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

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
