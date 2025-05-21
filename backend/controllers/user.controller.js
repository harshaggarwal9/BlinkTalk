import User from "../models/user.module.js"; // <-- ADD THIS LINE

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};