const jwt = require("jsonwebtoken");
const SECURE_KEY = process.env.SECURE_KEY;

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      console.log("No token provided");
      return res.status(401).send({ message: "Unauthorized User" });
    }

    token = token.split(" ")[1];
    console.log("Received Token:", token);

    jwt.verify(token, SECURE_KEY, (err, user) => {
      if (err) {
        console.log("JWT Verification Error:", err.message);
        return res
          .status(401)
          .json({ message: "Unauthorized User: Invalid token" });
      }
      console.log("Token Verified, User:", user);
      req.userId = user.id;
      next();
    });
  } catch (error) {
    console.log("Error in auth middleware:", error);
    res.status(401).send({ message: "Unauthorized User" });
  }
};

module.exports = auth;
