/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  signup_page: (req, res) => {
    res.locals.flash = _.clone(req.session.flash);
    res.view();
    req.session.flash = {};
  },

  signup: async (req, res) => {
    try {
      await User.create(req.allParams());
      res.send('Good');
      req.session.flash = {};
    } catch (err) {
      req.session.flash = {
        err: err
      };

      return res.redirect('/user/signup_page');
    }
  },

};
