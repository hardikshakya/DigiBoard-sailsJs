/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/

  jwtTokenSecret : process.env.JWT_TOKEN_SECRET,

  sendGridToken: process.env.SENDGRID_TOEKN,
  sendGridNewUserTemplateId: process.env.SENDGRID_NEW_USER_TEMPLATE_ID,

  openCageMapApiKey: process.env.OPENCAGE_API_KEY,

  trafficDataCsvFilePath: process.env.CSV_FILE_PATH,


};
