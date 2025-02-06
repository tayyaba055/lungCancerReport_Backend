const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173', 
  ];
app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) { // Allow requests without origin (like Postman)
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // VERY IMPORTANT: This allows cookies to be sent
    })
  );
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
const userRoutes = require("./src/routes/user.routes");

app.use("/api/v1/users", userRoutes);

app.get("/", function (req, res) {
    res.send("Server Running Successfully");
});

module.exports = app;
