module.exports = (req, res, ok) => {
  // User is allowed, proceed to controller
  if (req.session.User) {
    return ok();
  }

  // User is not allowed
  else {
    res.send(403);
  }
};
