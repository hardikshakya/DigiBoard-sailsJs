/**
 * Banner.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    user_id: {
      type: 'number'
    },
    banner_name: {
      type: 'string',
      required: true
    },
    location_address: {
      type: 'string',
      required: true
    },
    city_name: {
      type: 'string',
      required: true
    },
    region_name: {
      type: 'string',
      required: true
    },
    country_name: {
      type: 'string',
      required: true
    },
    banner_length: {
      type: 'number',
      required: true
    },
    banner_height: {
      type: 'number',
      required: true
    },
    is_active:{
      type: 'boolean',
      defaultsTo: false
    },
    latitude: {
      type: 'string'
    },
    longitude: {
      type: 'string'
    },
  },

};

