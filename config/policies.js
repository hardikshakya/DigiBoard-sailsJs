/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': 'flash',

  user: {
    'signup_page': 'flash',
    'signup': 'flash',

    'showProfile': 'userCanSeeProfile',
    'editUser' : 'userCanSeeProfile',
    'updateUser': 'userCanSeeProfile',

    'indexUser': 'admin',
    'destroyUser': 'admin',

    'subscribe': ['flash','authenticated'],
  }

};
