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

      res.view({
        banner: bannerData,
        user: userData
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

};

