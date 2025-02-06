const User = require("../models/user.model");

// Register User
const registerUser = async (req, res) => {
    try {
        const {  email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
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
        const newUser = new User({  email, password });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate the access token
        const token = user.generateAccessToken();
        console.log(token, "token");

        // Send token in response instead of a cookie
        res.status(200).json({
            message: "Login successful",
            token, // Include token in response
            user: {
                _id: user._id,
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

const updateUserDetails = async (req, res) => {
    try {
        const { firstName, lastName, fatherName, CNIC, gender } = req.body;
        const userId = req.user._id; 
      console.log(userId)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, fatherName, CNIC, gender },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserDetails
};
