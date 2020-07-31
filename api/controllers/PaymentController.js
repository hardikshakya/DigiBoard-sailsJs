/**
 * PaymentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  paymentPage: async (req, res) => {
    try {
      const requestedslotData = await Requestedslot.findOne(req.param('id'));
      const bannerData = await Banner.findOne({ 'id': requestedslotData.banner_id });
      const userData = await User.findOne({ 'id': requestedslotData.receiver_id });
      const timeslotData = await Timeslot.findOne({ 'id': requestedslotData.timeslot_id });

      res.view({
        request: requestedslotData,
        banner: bannerData,
        user: userData,
        timeslot: timeslotData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  transaction: async (req, res) => {
    try {
      const requestedslotData = await Requestedslot.findOne(req.param('id'));
      const bannerData = await Banner.findOne({ 'id': requestedslotData.banner_id });
      const timeslotData = await Timeslot.findOne({ 'id': requestedslotData.timeslot_id });
      const publisherUserData = await User.findOne({ 'id': bannerData.user_id });
      const advertiserUserData = await User.findOne({ 'id': requestedslotData.sender_id });
      const stripe = require('stripe')(`${publisherUserData.pay_sk}`);
      const amount = timeslotData.price * 100;

      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => stripe.charges.create({
        amount,
        description: `${advertiserUserData.name} has paid for Banner ' ${bannerData.banner_name} '. Order Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to}.`,
        currency: 'inr',
        customer: customer.id
      }));

      // await Timeslot.update({ id: timeslotData.id }).set({ paid: true });
      await Notification.update({ request_id: requestedslotData.id }).set({ action: 'paid' });
      const advertisementData = await Advertisement.update({ timeslot_id: timeslotData.id }).set({ is_paid: true }).fetch();

      const paymentObj = {
        payment_type: 'card',
        payee_id: advertiserUserData.id,
        drawee_id: publisherUserData.id,
        banner_id: bannerData.id,
        timeslot_id: timeslotData.id,
        advertisement_id: advertisementData[0].id,
        price: timeslotData.price
      };
      await Payment.create(paymentObj);

      const publisherNotifyObj = {
        receiver_id: publisherUserData.id,
        notifier_id: advertiserUserData.id,
        request_id: requestedslotData.id,
        request_type: 'payment done',
        message: `${advertiserUserData.name} has paid ${timeslotData.price} Rs. for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} .`
      };
      await Notification.create(publisherNotifyObj);

      sails.sockets.broadcast(
        'user',
        'user_banner_actions',
        {
          user_id: publisherUserData.id,
          sen_id: advertiserUserData.id,
          msg: `${advertiserUserData.name} has paid ${timeslotData.price} Rs. for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} .`
        }
      );

      const advertiserNotifyObj = {
        receiver_id: advertiserUserData.id,
        notifier_id: advertiserUserData.id,
        request_id: requestedslotData.id,
        request_type: 'payment done',
        message: `You paid ${timeslotData.price} Rs. for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} .`
      };
      await Notification.create(advertiserNotifyObj);

      sails.sockets.broadcast(
        'user',
        'user_banner_actions',
        {
          user_id: advertiserUserData.id,
          sen_id: advertiserUserData.id,
          msg: `You paid ${timeslotData.price} Rs. for Banner ' ${bannerData.banner_name} '. Request's Deatails :Date ${timeslotData.date} , Time ${timeslotData.time_from} to ${timeslotData.time_to} .`
        }
      );

      res.redirect('/banner/success/'+ timeslotData.id);
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },

  success: async (req, res) => {
    try {
      const timeslotData = await Timeslot.findOne(req.param('id'));

      res.view({
        timeslot: timeslotData
      });
    } catch (error) {
      return res.HandleResponse(error, false);
    }
  },
};

