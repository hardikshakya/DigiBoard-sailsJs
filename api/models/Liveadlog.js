/**
 * Liveadlog.js
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
    timeslot_id: {
      type: 'number'
    }
  },

};

