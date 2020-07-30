/**
 * NotificationactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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

};

