const jwt = require("jsonwebtoken");
const SECURE_KEY = process.env.SECURE_KEY;

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECURE_KEY);
      req.userId = user.id;
    } else {
      return res.status(401).send({ message: "Unauthorized User" });
    }
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ message: "Unauthorized User" });
  }
};

module.exports = auth;
