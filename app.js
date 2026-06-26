if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const restaurantRouter = require("./routes/restaurants.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const chatRouter = require("./routes/chat.js");

const app = express();
const PORT = process.env.PORT || 5000;
const dbUrl = process.env.ATLASDB_URL;

// DB
mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Error:", err));

// CORS — allow React dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
const sessionOptions = {
  secret: process.env.SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbUrl, ttl: 7 * 24 * 60 * 60 }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  },
};
app.use(session(sessionOptions));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/api/restaurants", restaurantRouter);
app.use("/api/restaurants/:id/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Something went wrong" });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
