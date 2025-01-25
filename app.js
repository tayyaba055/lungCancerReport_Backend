const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
    cors({
        origin:
            process.env.CORS_ORIGIN ||
            "http://localhost:5173" ||
            "http://localhost:5174",
        // credentials: true,
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
