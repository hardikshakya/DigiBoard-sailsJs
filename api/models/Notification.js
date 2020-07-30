/**
 * Notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    receiver_id: {
      type: 'number'
    },
    notifier_id: {
      type: 'number'
    },
    request_id: {
      type: 'number'
    },
    request_type: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    is_viewed: {
      type: 'boolean',
      defaultsTo: false
    },
    action: {
      type: 'string',
      defaultsTo: 'none'
    }
  },

};

