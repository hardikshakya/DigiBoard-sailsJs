/**
 * Publisher.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    username: {
      type: 'string'
    },
    mobile: {
      type: 'number'
    },
    address: {
      type: 'string'
    },
    designation: {
      type: 'string'
    },
    user_id: {
      model: 'user'
    }
  },

};

