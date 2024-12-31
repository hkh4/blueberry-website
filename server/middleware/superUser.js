const jwt = require("jsonwebtoken")
const User = require("./../mongodb/models/User")

const superUser = async (req, res, next) => {

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
    const user = await User.findOne({ _id }).select('_id')
    req.user = user

    // Check that this user has the credentials
    if (!user.admin) {
        let err = new Error("Forbidden access")
        err.status = 403
        throw err
    }

    next()

  } catch (e) {
    e.redirect = true
    next(e);
  }
};

module.exports = superUser