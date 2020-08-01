/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  '/user/signup_page': 'user/signup_page',
  '/user/publishercreatepage/:id': 'user/publisherCreatePage',
  '/user/advertisercreatepage/:id': 'user/advertiserCreatePage',

  '/user/signup': 'user/signup',
  '/user/createpublisher': 'user/createPublisher',
  '/user/createadvertiser': 'user/createAdvertiser',

  '/user/sendmail/:id': 'user/sendmail',
  '/user/confirmation': 'user/confirmation',

  '/user/showprofile/:id': 'user/showProfile',

  '/user/indexuser': 'user/indexUser',

  '/user/edituser/:id': 'user/editUser',

  '/user/updateuser/:id': 'user/updateUser',

  '/user/destroyuser/:id': 'user/destroyUser',

  '/session/loginpage': 'session/loginPage',
  '/session/login': 'session/logIn',
  '/session/logout': 'session/logOut',

  '/banner/newbanner/:id': 'banner/newBanner',

  '/banner/createbanner': 'banner/createBanner',
  '/banner/showbanner/:id': 'banner/showBanner',
  '/banner/editbanner/:id': 'banner/editBanner',
  '/banner/updatebanner/:id': 'banner/updateBanner',
  '/banner/destroybanner/:id': 'banner/destroyBanner',

  '/banner/indexyourbanner/:id': 'banner/indexYourBanner',
  '/banner/indexbanner': 'banner/indexBanner',

  '/banner/mapselectedbanner/:id': 'banner/mapSelectedBanner',

  'GET /banner/showtraffic/:id': 'banner/showTraffic',

  '/banner/createtimeslotpage/:id': 'banner/createTimeSlotPage',
  '/banner/addnewtimeslot': 'banner/addNewTimeslot',
  '/banner/destroytimeslot/:id': 'banner/destroyTimeslot',

  '/user/indexnotification/:id': 'notificationaction/indexNotification',
  '/banner/requestslot/:id': 'banner/requestSlot',
  '/banner/acceptslot/:id': 'banner/acceptSlot',

  '/banner/uploadcontent/:id': 'notificationaction/uploadContentPage',
  '/banner/uploadadvertisement/:id': 'notificationaction/uploadAdvertisement',

  '/banner/paymentpage/:id': 'payment/paymentPage',
  '/banner/transaction/:id': 'payment/transaction',
  '/banner/success/:id': 'payment/success',
  '/user/indexyourorder/:id': 'payment/indexYourOrder',
  '/user/indexyourpayment/:id': 'payment/indexYourPayment',

  '/banner/showadvertisement/:id': 'banner/showActiveAdvertisement',
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
