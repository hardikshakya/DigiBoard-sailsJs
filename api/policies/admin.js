module.exports = (req, res, ok) => {
  // User is allowed, proceed to controller
  if ((req.session.User) && (req.session.User.role === 'publisher')) {
    return ok();
  }
  // User is not allowed
  else {
    const requirePublisherError = [{name: 'requirePublisherError', message: 'You must be a publisher.'}];

    req.session.flash = {
      err: requirePublisherError
    };
    res.redirect('/session/loginpage');
    return;
  }
};
