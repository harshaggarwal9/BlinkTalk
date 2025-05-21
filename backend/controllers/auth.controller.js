import User from "../models/user.module.js"; 
import bcrypt from "bcryptjs"; 
import generateToken from "../utils/generatetoken.js";

// SIGNUP controller
export const signup = async (req, res) => {
  try {
    // ADD THIS LINE:
    console.log("Incoming Request Body:", req.body);

    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);


    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
   if(newUser){
    //generate JWT token
    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      gender: newUser.gender,
      profilepic: newUser.profilepic,
    });
   }
   else{
    res.status(400).json({ error: "User not created" });
   }
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN controller 
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const ispasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !ispasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT controller
export const logout = (req, res) => {
 try {
   res.cookie("jwt", "", {
     maxAge: 0
   });
   res.status(200).json({ message: "Logout successful" });
 } catch (error) {
   console.log("Logout error:", error.message);
   res.status(500).json({ error: "Server error" });
 }
};


