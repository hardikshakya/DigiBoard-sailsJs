/**
 * Payment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    payment_type: {
      type: 'string'
    },
    payee_id: {
      type: 'number'
    },
    drawee_id: {
      type: 'number'
    },
    banner_id: {
      type: 'number'
    },
    timeslot_id: {
      type: 'number'
    },
    advertisement_id: {
      type: 'number'
    },
    price: {
      type: 'string'
    },
  },

};

