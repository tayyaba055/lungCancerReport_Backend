const User = require("../models/user.model");

// Register User
const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if all fields are provided
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ userName, email, password });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                profilePicture: newUser.profilePciture,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password,  } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate the access token
        const token = user.generateAccessToken();

        // Set the cookie with the token
        res.cookie("session_token", token, {
            httpOnly: true, // Prevent access by JavaScript (protects against XSS)
            secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
            sameSite: "strict", // Prevent cross-site cookie usage
            maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        });

        // Send response to client
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
