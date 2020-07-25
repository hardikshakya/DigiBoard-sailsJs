/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      isEmail: true,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    confirmed: {
      type: 'boolean',
      defaultsTo: false
    },
    online: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  customToJSON: function () {
    return _.omit(
      this,
      ['password', 'confirmation', 'encryptedPassword', '_csrf']
    );
  },

};

