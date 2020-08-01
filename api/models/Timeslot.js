/**
 * Timeslot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    banner_id: {
      type: 'number'
    },
    date: {
      type: 'string'
    },
    day: {
      type: 'string'
    },
    time_from: {
      type: 'string'
    },
    time_to: {
      type: 'string'
    },
    is_active: {
      type: 'boolean',
      defaultsTo: false
    },
    is_requested: {
      type: 'boolean',
      defaultsTo: false
    },
    price: {
      type: 'string'
    },
    is_paid: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

