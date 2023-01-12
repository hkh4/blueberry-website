const jwt = require("jsonwebtoken")
const User = require("./../mongodb/models/User")

const requireAuth = async (req, res, next) => {

  try {
    // Verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Authorization header required")
    }

    const token = authorization.split(" ")[1]

    // Verify token
    const {_id, admin} = jwt.verify(token, process.env.SECRET)

    // Attach user to request. Look up the user in the database to be safe, make sure this user still actually exists
    req.user = await User.findOne({ _id }).select('_id')

    next()

  } catch (e) {
    e.status = 401
    e.message = e.message === "Authorization header required" ? e.message : "Request is not authorized"
    e.redirect = true
    next(e);
  }
};

module.exports = requireAuth