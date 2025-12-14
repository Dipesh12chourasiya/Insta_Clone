const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");


dotenv.config();
connectDB();

const app = express();

// middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes); 

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server in ${process.env.NODE_MODE} mode at http://localhost:${PORT}`
  );
});
