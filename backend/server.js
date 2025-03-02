const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/Authroutes");
const attackLogsRouter = require("./routes/attackLogs");
const blockedUsersRouter = require("./routes/blocking");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to connect

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blockedUsers", blockedUsersRouter);
app.use("/api", attackLogsRouter); // Add this line to use the attackLogs route


// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/honeypot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));