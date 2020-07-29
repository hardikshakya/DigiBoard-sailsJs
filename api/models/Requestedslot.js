/**
 * Requestedslot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    sender_id: {
      type: 'number'
    },
    receiver_id: {
      type: 'number'
    },
    banner_id: {
      type: 'number'
    },
    timeslot_id: {
      type: 'number'
    },
    price: {
      type: 'number',
      defaultsTo: 10
    },
    is_accepted: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

