/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');

module.exports = {
  loginPage: (req, res) => {
    res.view('session/loginpage');
  },

  logIn: async (req, res) => {
    try {
      const { email, password} = req.allParams();

      if (!email || !password) {
        const usernamePasswordRequiredError = [{
          name: 'usernamePasswordRequired',
          message: 'You must enter both a username and password.'
        }];

        req.session.flash = {
          err: usernamePasswordRequiredError
        };
        res.redirect('/session/loginpage');
        return;
      }

      const userData = await User.findOne({ 'email': email });

      if (!userData) {
        const noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + email + ' not found.'
        }];
        req.session.flash = {
          err: noAccountError
        };
        res.redirect('/session/loginpage');
        return;
      }

      if(!userData.confirmed) {
        const noAccountVerifiedError = [{
          name: 'noAccountVerified',
          message: 'Please confirm your email ' + email + ' to login.'
        }];
        req.session.flash = {
          err: noAccountVerifiedError
        };
        res.redirect('/session/loginpage');
        return;
      }

      bcrypt.compare(
        password,
        userData.encryptedPassword,
        async (err, valid) => {
          if (err) {
            req.session.flash = {
              err: err
            };
            return res.redirect('/session/loginpage');
          }

          if (!valid) {
            const usernamePasswordMismatchError = [{
              name: 'usernamePasswordMismatch',
              message: 'Invalid username and password combination.'
            }];
            req.session.flash = {
              err: usernamePasswordMismatchError
            };
            res.redirect('/session/loginpage');
            return;
          }

          req.session.authenticated = true;
          req.session.User = userData;
          req.session.verified = userData.confirmed;

          const updatedUserData = await User.update({ id: userData.id }).set({ online: true }).fetch();
          let logedInUser;

          if (req.session.User.role === 'publisher') {
            logedInUser = await Publisher.findOne({ 'user_id': userData.id });
            req.session.Publisher = logedInUser;
          }

          if (req.session.User.role === 'advertiser') {
            logedInUser = await Advertiser.findOne({ 'user_id': userData.id });
            req.session.Advertiser = logedInUser;
          }

          User.publish(_.pluck(updatedUserData, 'id'), {
            verb : 'update',
            model : 'user',
            loggedIn: true,
            id: updatedUserData[0].id,
            name: updatedUserData[0].name,
            action: ' has logged in.'
          });

          res.redirect('/user/showprofile/' + userData.id);
        }
      );

    } catch (error) {
      req.session.flash = {
        err: error
      };
      return res.redirect('/session/loginpage');
    }
  },

  logOut: async (req, res) => {
    try {
      const userId = req.session.User.id;
      const updatedUserData = await User.update({ id: userId }).set({ online: false }).fetch();

      User.publish(_.pluck(updatedUserData, 'id'), {
        verb : 'update',
        model : 'user',
        loggedIn: false,
        id: updatedUserData[0].id,
        name: updatedUserData[0].name,
        action: ' has logged out.'
      });

      req.session.destroy();
      res.redirect('/session/loginpage');
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

};

