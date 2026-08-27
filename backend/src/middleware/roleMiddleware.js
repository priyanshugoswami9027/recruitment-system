const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'User role not found. Please authenticate first.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    
    next();
  };
};

module.exports = { authorize };