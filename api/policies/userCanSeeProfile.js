module.exports = (req, res, ok) => {

  let sessionUserMatchesId;

  if (req.session.User.id === parseInt(req.param('id'))) {
    sessionUserMatchesId = 1;
  } else {
    sessionUserMatchesId = 0;
  }
  const isAdmin = req.session.User.role;

  // The requested id does not match the user's id,
  // and this is not an admin
  if (!(sessionUserMatchesId || isAdmin === 'publisher')) {
    const noRightsError = [{name: 'noRights', message: 'You must be a publisher.'}];

    req.session.flash = {
      err: noRightsError
    };
    res.redirect('/session/loginpage');
    return;
  }

  ok();
};
