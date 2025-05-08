const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // DEVELOPMENT MODE - Comment out this section when moving to production
  // This bypasses authentication for development purposes
  req.user = { id: 'dev-user-id' };
  return next();
  
  // PRODUCTION CODE below - uncomment when moving to production
  /*
  // Get token from header
  const token = req.header("x-auth-token");
  
  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied"
    });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
  */
};