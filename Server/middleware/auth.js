const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authentication = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  const data = token.split(" ")[1];

  try {
    const decoded = jwt.verify(data, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(404).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

const authorizeRole = (roles)=> (req,res, next) => {
  if(!roles.includes(req.user.role)){
    return res.status(403).json({msg: "Access denied"})
  }
  next()
}

module.exports ={
  authentication,
  authorizeRole
} ;
