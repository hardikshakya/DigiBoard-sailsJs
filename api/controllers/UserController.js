/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const request = require('request');
const jwt = require('jsonwebtoken');
const url = require('url');
const bcrypt = require('bcrypt');

module.exports = {
  signup_page: (req, res) => {
    res.view();
  },

  publisherCreatePage: (req, res) => {
    res.view();
  },

  advertiserCreatePage: (req, res) => {
    res.view();
  },

  signup: async (req, res) => {
    try {
      const reqObj = req.allParams();

      if (!reqObj.password  || reqObj.password !== reqObj.confirmation) {
        req.session.flash = {
          err: ['Password doesn\'t match password confirmation.']
        };
        return res.redirect('/user/signup_page');
      }

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(reqObj.password, salt);

      reqObj.encryptedPassword = encryptedPassword;
      const userData = await User.create(reqObj).fetch();

      req.session.authenticated = true;
      req.session.User = userData;
      req.session.verified = false;

      res.redirect('/user/sendmail/'+ userData.id);
    } catch (err) {
      req.session.flash = {
        err: err
      };
      return res.redirect('/user/signup_page');
    }
  },

  sendmail: async (req, res) => {
    try {
      const userData = await User.findOne(req.param('id'));
      const token = jwt.sign({ id: userData.id }, sails.config.custom.jwtTokenSecret, { expiresIn: '1h' });
      console.log(`http://localhost:1337/user/confirmation?id=${token}`);
      const options = {
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
          'content-type': 'application/json',
          authorization: sails.config.custom.sendGridToken
        },
        body:{
          personalizations: [
            {
              to: [ { email: userData.email, name: userData.name } ],
              dynamic_template_data: {
                'name': userData.name,
                'token': token
              }
            }
          ],
          from: {
            email: 'noreply@digiboard.com',
            name: 'DigiBoard APP'
          },
          reply_to: {
            email: 'noreply@digiboard.com',
            name: 'DigiBoard APP'
          },
          template_id: sails.config.custom.sendGridNewUserTemplateId
        },
        json: true
      };

      request(options, (error, response, body) => {
        if (error) return res.HandleResponse(error, false);

        req.session.authenticated = false;
        res.redirect('/session/loginpage');
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }

  },

  confirmation: async (req, res) => {
    try {
      const urlParts = url.parse(req.url, true);
      const urlInfo = urlParts.query;
      const urlData = jwt.verify(urlInfo.id, sails.config.custom.jwtTokenSecret);
      const userData = await User.findOne(urlData.id);

      req.session.authenticated = true;
      req.session.User = userData;
      req.session.verified = true;

      if (userData.role === 'publisher') {
        res.redirect('/user/publishercreatepage/'+ userData.id);
      }
      if (userData.role === 'advertiser') {
        res.redirect('/user/advertisercreatepage/'+ userData.id);
      }
    } catch(error){
      return res.HandleResponse(error, false);
    }
  },

  createPublisher: async (req,res) => {
    try {
      const publisherData = await Publisher.create(req.allParams()).fetch();
      const userId = req.session.User.id;

      req.session.authenticated = true;
      req.session.Publisher = publisherData;
      req.session.verified = true;

      await Publisher.update({ id: publisherData.id }).set( { user_id: userId  } );
      await User.update({ id: userId }).set({
        confirmed: true,
        online: true,
        pay_pk: req.param('pay_pk'),
        pay_sk: req.param('pay_sk')
      });

      res.redirect('/user/showprofile/'+ userId);
    } catch(err) {
      req.session.flash = {
        err: err
      };
      return res.redirect('/user/signup_page');
    }
  },

  createAdvertiser: async (req,res) => {
    try{
      const advertiserData = await Advertiser.create(req.allParams()).fetch();
      const userId = req.session.User.id;

      req.session.authenticated = true;
      req.session.Advertiser = advertiserData;
      req.session.verified = true;

      await Advertiser.update({ id: advertiserData.id }).set( { user_id: userId  } );
      await User.update({ id: userId }).set({
        confirmed: true,
        online: true
      });

      res.redirect('/user/showprofile/'+ userId);
    }
    catch(err){
      req.session.flash = {
        err: err
      };
      return res.redirect('/user/signup_page');
    }
  },

  showProfile: async (req, res) => {
    try {
      const userData = await User.findOne(req.param('id'));
      let profileUserData;

      if (userData.role === 'publisher') {
        profileUserData = await Publisher.findOne({ 'user_id': userData.id });
        req.session.Publisher = profileUserData;
      }

      if (userData.role === 'advertiser') {
        profileUserData = await Advertiser.findOne({ 'user_id': userData.id });
        req.session.Advertiser = profileUserData;
      }

      const profileData = Object.assign(userData, profileUserData);

      res.view({
        user: profileData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  indexUser: async (req, res) => {
    try {
      const allUserData = await User.find().sort('name ASC');

      res.view({
        users: allUserData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  editUser: async (req, res) => {
    try {
      const userData = await User.findOne((req.param('id')));
      let editUserData;

      if (userData.role === 'publisher') {
        editUserData = await Publisher.findOne({ 'user_id': userData.id });
        req.session.Publisher = editUserData;
      }

      if (userData.role === 'advertiser') {
        editUserData = await Advertiser.findOne({ 'user_id': userData.id });
        req.session.Advertiser = editUserData;
      }

      const editData = Object.assign(userData, editUserData);

      res.view({
        user: editData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id, name, username, mobile, address, designation } = req.allParams();
      const updatedUserData = await User.update(id).set({ name: name }).fetch();

      if (updatedUserData[0].role === 'publisher') {
        await Publisher.update({ user_id: id }).set({
          username: username,
          mobile: mobile,
          address: address,
          designation: designation
        });
      }

      if (updatedUserData[0].role === 'advertiser') {
        await Advertiser.update({ user_id: id }).set({
          username: username,
          mobile: mobile,
          address: address,
          designation: designation
        });
      }

      res.redirect('/user/showprofile/' + id);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  destroyUser: async (req, res) => {
    try {
      const userData = await User.destroy(req.param('id')).fetch();

      if (userData.role === 'publisher') {
        await Publisher.destroy({ 'user_id': userData.id });
      }
      if (userData.role === 'advertiser') {
        await Advertiser.destroy({ 'user_id': userData.id });
      }

      sails.sockets.blast({
        id: parseInt(req.param('id')),
        verb : 'destroy',
        model : 'user'
      });

      res.redirect('/user/indexuser');
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  subscribe: (req, res) => {
    if (!req.isSocket) {
      return res.badRequest('Only a client socket can subscribe to Louies.  But you look like an HTTP request to me.');
    }

    User.find((err, users) => {
      if (err) return next(err);

      User.subscribe(req.socket,  _.pluck(users, 'id'));
      sails.sockets.join(req, 'user');

      res.send(200);
    });
  }

};
