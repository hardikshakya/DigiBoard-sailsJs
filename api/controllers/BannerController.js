/**
 * BannerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
  }

};

