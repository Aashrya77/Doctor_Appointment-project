const User = require("../model/User");

const register = async (req, res) => {
  try {
    const { name, email, password, role, gender } = req.body;
    if (!name || !email || !password || !role || !gender) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    if (!["Patient", "Doctor"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role. Choose 'Patient' or 'Doctor'." });
    }
    const user = await User.create({ name, email, password, role, gender });
    const token = user.createToken();
    res.status(201).json({ token, role });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = password && await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = user.createToken();
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" });  
    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, getUserProfile, getDoctors };
