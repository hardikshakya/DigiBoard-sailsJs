/**
 * Advertisement.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    advertiser_user_id: {
      type: 'number'
    },
    request_id: {
      type: 'number'
    },
    banner_id: {
      type: 'number'
    },
    timeslot_id: {
      type: 'number'
    },
    advertisement_title: {
      type: 'string'
    },
    advertisement_description: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    is_paid: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

