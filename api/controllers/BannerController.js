/**
 * BannerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const request = require('request');
const { PythonShell } = require('python-shell');

module.exports = {
  newBanner: (req, res) => {
    res.view();
  },

  createBanner: async (req, res) => {
    try {
      const bannerData = await Banner.create(req.allParams()).fetch();
      const userId = req.session.User.id;

      req.session.authenticated = true;
      req.session.Banner = bannerData;
      req.session.verified = true;

      await Banner.update({ id: bannerData.id }).set({ user_id: userId });
      res.redirect('/banner/showbanner/'+ bannerData.id);
    } catch (error) {
      res.HandleResponse(error, false);
      req.session.flash = {
        err: error
      };
      return res.redirect('/user/signup_page');
    }
  },

  showBanner: async (req, res) => {
    try {
      const bannerData = await Banner.findOne(req.param('id'));
      const userData = await User.findOne({ 'id': bannerData.user_id });
      const allTimeslotsData = await Timeslot.find({ 'banner_id': bannerData.id });
      const requestedslotsData = await Requestedslot.find({ 'banner_id': bannerData.id });

      res.view({
        banner: bannerData,
        user: userData,
        timeslots: allTimeslotsData,
        requestedslots: requestedslotsData,
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  indexYourBanner: async (req, res) => {
    try {
      const userId = parseInt(req.param('id'));
      const allBannersData = await Banner.find();

      res.view({
        user_id: userId,
        banners: allBannersData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  editBanner: async (req, res) => {
    try {
      const bannerData = await Banner.findOne(req.param('id'));

      res.view({
        banner: bannerData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  updateBanner: async (req, res) => {
    try {
      await Banner.update(req.param('id'), req.allParams());

      res.redirect('/banner/showbanner/' + req.param('id'));
    } catch (error) {
      req.session.flash = {
        err: error
      };
      return res.redirect('/banner/editbanner/' + req.param('id'));
    }
  },

  destroyBanner: async (req, res) => {
    try {
      const bannerData = await Banner.destroy(req.param('id')).fetch();

      if (bannerData[0]) {
        res.redirect('/banner/indexyourbanner/'+ bannerData[0].user_id);
      } else {
        return res.HandleResponse('Banner doesn\'t exist.', false);
      }

    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  indexBanner: async (req, res) => {
    try {
      const allBannerData = await Banner.find();

      res.view({
        banners: allBannerData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  mapSelectedBanner: async (req, res) => {
    try {
      const bannerData = await Banner.findOne(req.param('id'));
      const encodedAddress = encodeURIComponent(bannerData.location_address);

      request({
        url: `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${sails.config.custom.openCageMapApiKey}&pretty=1`,
        json: true
      },async (error, response, body) => {
        const lat = body.results[0].geometry.lat;
        const lng = body.results[0].geometry.lng;

        await Banner.update({id: bannerData.id }).set({ latitude: lat, longitude: lng });
      });

      res.view({
        banner: bannerData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  showTraffic: async (req, res) => {
    try {
      const bannerData = await Banner.findOne(req.param('id'));
      let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: 'assets/python',
        args: [sails.config.custom.trafficDataCsvFilePath, `${bannerData.city_name}`]
      };

      PythonShell.run('trafficdata.py', options, (err, results) => {
        if (err) throw err;
        const myArray = JSON.stringify(results);

        return res.send(myArray);
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  createTimeSlotPage: async (req, res) => {
    try {
      const bannerData = await Banner.findOne(req.param('id'));

      res.view({
        banner: bannerData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  addNewTimeslot: async (req, res) => {
    try {
      const timeslotData = await Timeslot.create(req.allParams()).fetch();
      const bannerId = req.param('banner_id');
      const dateArray = JSON.parse(req.param('date_array'));
      const weekArray = JSON.parse(req.param('week_array'));
      const startTimeArray = JSON.parse(req.param('starttime_array'));
      const endTimeArray = JSON.parse(req.param('endtime_array'));
      const priceArray = JSON.parse(req.param('price_array'));

      req.session.authenticated = true;
      req.session.Timeslot = timeslotData;
      req.session.verified = true;

      for (let index = 0; index < dateArray.length; index++) {
        for (let index1 = 0; index1 < startTimeArray.length; index1++) {
          let INSERT_QUERY =
          `
          INSERT INTO
            timeslot
          (createdAt, updatedAt, banner_id, date, day, time_from, time_to, is_active, is_requested, price)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `;

          await sails.sendNativeQuery(
            INSERT_QUERY,
            [
              Date.now(),
              Date.now(),
              bannerId,
              dateArray[index],
              weekArray[index],
              startTimeArray[index1],
              endTimeArray[index1],
              0,
              0,
              priceArray[index1]
            ]
          );
        }
      }

      res.redirect('/banner/showbanner/'+ bannerId);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  destroyTimeslot: async (req, res) => {
    try {
      const timeslotData = await Timeslot.findOne(req.param('id'));

      if (!timeslotData.is_active) {
        await Timeslot.destroy(req.param('id'));
      }

      res.redirect('/banner/showbanner/'+ timeslotData.banner_id);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  requestSlot: async (req, res) => {
    try {
      const timeslotData = await Timeslot.findOne(req.param('id'));
      const bannerData = await Banner.findOne({ id: timeslotData.banner_id });
      const receiverData = await User.findOne({ id: bannerData.user_id });
      const senderData = await User.findOne({ id: req.session.User.id });
      const requestedslotObj = {
        sender_id: senderData.id,
        receiver_id: receiverData.id,
        banner_id: bannerData.id,
        timeslot_id: timeslotData.id
      };
      const requestedslotData = await Requestedslot.create(requestedslotObj).fetch();
      const notificationObj = {
        receiver_id: receiverData.id,
        notifier_id: senderData.id,
        request_id: requestedslotData.id,
        request_type: 'request',
        message: `${senderData.name} has requested for Banner ' ${bannerData.banner_name} ' on date ${timeslotData.date} from time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
      };

      await Notification.create(notificationObj);
      await Timeslot.update({id: timeslotData.id }).set( { is_requested: true });

      req.session.Request = requestedslotData;

      sails.sockets.broadcast(
        'user',
        'user_banner_actions',
        {
          user_id: receiverData.id,
          sen_id: senderData.id,
          msg: `${senderData.name} has requested for Banner ' ${bannerData.banner_name} ' on date ${timeslotData.date} from time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
        }
      );

      res.redirect('/banner/showbanner/'+ bannerData.id);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  acceptSlot: async (req, res) => {
    try {
      const requestedslotData = await Requestedslot.update({ id: req.param('id') }).set({ is_accepted: true }).fetch();
      const requestsForSlot = await Requestedslot.find({ 'timeslot_id': requestedslotData[0].timeslot_id });
      const receiverData = await User.findOne({ id: requestedslotData[0].receiver_id });
      const timeslotData = await Timeslot.findOne({ id: requestedslotData[0].timeslot_id });

      await Timeslot.update({ id: requestedslotData[0].timeslot_id }).set({ is_active: true  });

      for (let index = 0; index < requestsForSlot.length; index++) {
        const senderData = await User.findOne({ id: requestsForSlot[index].sender_id });
        const bannerData = await Banner.findOne({ id: requestsForSlot[index].banner_id });

        if (!requestsForSlot[index].is_accepted) {
          await Notification.update({ request_id: requestsForSlot[index].id }).set({ action: 'reject' });

          const notificationObj = {
            receiver_id: senderData.id,
            notifier_id: receiverData.id,
            request_id: requestsForSlot[index].id,
            request_type: 'request reject',
            message: `${receiverData.name} has rejected your request for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
          };
          await Notification.create(notificationObj);

          sails.sockets.broadcast(
            'user',
            'user_banner_actions',
            {
              user_id: senderData.id,
              sen_id: receiverData.id,
              msg: `${receiverData.name} has rejected your request for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
            }
          );
        }

        if (requestsForSlot[index].is_accepted) {
          await Notification.update({ request_id: requestsForSlot[index].id }).set({ action: 'accept' });

          const notificationObj = {
            receiver_id: senderData.id,
            notifier_id: receiverData.id,
            request_id: requestsForSlot[index].id,
            request_type: 'request accepet',
            message: `${receiverData.name} has accepeted your request for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
          };
          await Notification.create(notificationObj);

          sails.sockets.broadcast(
            'user',
            'user_banner_actions',
            {
              user_id: senderData.id,
              sen_id: receiverData.id,
              msg: `${receiverData.name} has accepeted your request for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} for ${timeslotData.price} Rs.`
            }
          );
        }
      }

      res.redirect('/user/indexnotification/'+ receiverData.id);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

};

