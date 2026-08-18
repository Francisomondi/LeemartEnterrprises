import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import mpesaRoutes from "./routes/mpesa.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import orderRoutes from "./routes/order.route.js";
import Product from "./models/product.model.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

/* ------------------ CORE MIDDLEWARE ------------------ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ------------------ CORS ------------------ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://leemartenterrprises.onrender.com",
  "https://www.leemart.co.ke",
];

app.use(
  "/api",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.options("/api/*", cors());

/* ------------------ API ROUTES ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);

app.get("/product/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.sendFile(
        path.join(__dirname, "frontend", "dist", "index.html")
      );
    }

    const image =
      product.images?.[0] ||
      "https://www.leemart.co.ke/banner.png";

    const title = `${product.name} | Leemart Investments`;
    const description =
      product.description ||
      "Shop quality products at Leemart Investments.";

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>

  <meta name="description" content="${description}">

  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Leemart Investments">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="https://www.leemart.co.ke/product/${product._id}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">

  <script>
    window.location.href = "/product/${product._id}";
  </script>
</head>
<body></body>
</html>
    `);
  } catch (error) {
    next(error);
  }
});

/* ------------------ STATIC FRONTEND ------------------ */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));


  //share preview
  



  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

/* ------------------ START SERVER ------------------ */
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});