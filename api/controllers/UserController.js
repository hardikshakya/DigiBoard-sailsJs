/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  signup_page: (req, res) => {
    res.view();
  },

  signup: (req, res, next) => {
    User.create(req.allParams(), (err, user) => {
      if (err) return next(err);

      res.json(user);
    });
  },

};
