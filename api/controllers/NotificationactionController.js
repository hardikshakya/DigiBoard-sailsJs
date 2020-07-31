/**
 * NotificationactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Path = require('path');

module.exports = {
  indexNotification: async (req, res) => {
    try {
      const receiverUserData = await User.findOne(req.param('id'));
      const notificationsData = await Notification.find({ 'receiver_id': receiverUserData.id }).sort('createdAt DESC');
      const sendersUserDataArray = [];

      for (let index = 0; index < notificationsData.length; index++) {
        let temp = notificationsData[index].notifier_id;
        let tempUserData = await User.findOne({ 'id': notificationsData[index].notifier_id });

        sendersUserDataArray[temp] = tempUserData;
      }

      res.view({
        user: receiverUserData,
        notifications: notificationsData,
        sendersUserDataArray: sendersUserDataArray
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  uploadContentPage: async (req, res) => {
    try {
      const requestedslotData = await Requestedslot.findOne(req.param('id'));

      res.view({
        request: requestedslotData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  uploadAdvertisement: async (req, res) => {
    try {
      const requestedslotData = await Requestedslot.findOne(req.param('id'));
      const existAdvertisement = await Advertisement.findOne({ timeslot_id: requestedslotData.timeslot_id });

      if (existAdvertisement) {
        req.file('file').upload({
          dirname: Path.resolve(sails.config.appPath, 'assets/upload_data')
        }, async (err, files) => {
          if (err) {
            req.session.flash = {
              err: error
            };
            return res.redirect('/banner/uploadcontent/' + requestedslotData.id);
          }

          let fdr = files[0].fd;
          let fdr1 = fdr.split(`${sails.config.appPath}${sails.config.custom.assetsFolder}`).pop();

          await Advertisement.update({ id: existAdvertisement.id }).set({
            content_title: req.param('content_title'),
            content_description: req.param('content_description'),
            content: fdr1
          });
        });
      } else {
        req.file('file').upload({
          dirname: Path.resolve(sails.config.appPath, 'assets/upload_data')
        }, async (err, files) => {
          if (err) {
            req.session.flash = {
              err: error
            };
            return res.redirect('/banner/uploadcontent/' + requestedslotData.id);
          }

          let fdr = files[0].fd;
          let fdr1 = fdr.split(`${sails.config.appPath}${sails.config.custom.assetsFolder}`).pop();

          const advertisementObj = {
            advertiser_user_id: requestedslotData.sender_id,
            request_id: requestedslotData.id,
            banner_id: requestedslotData.banner_id,
            timeslot_id: requestedslotData.timeslot_id,
            advertisement_title: req.param('content_title'),
            advertisement_description: req.param('content_description'),
            content: fdr1
          };

          await Advertisement.create(advertisementObj);
        });
      }

      res.redirect('/banner/paymentpage/'+ requestedslotData.id);
    } catch (error) {
      req.session.flash = {
        err: error
      };
      return res.redirect('/banner/uploadcontent/' + req.param('id'));
    }
  }

};

