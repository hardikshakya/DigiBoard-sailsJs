$(document).ready(() => {
  $('#sign-up-form').validate({
	  rules: {
	    name: {
	      required: true
	    },
	    email: {
	      required: true,
	      email: true
	    },
	    password: {
	      minlength: 6,
	      required: true
	    },
	    confirmation: {
	      minlength: 6,
	      equalTo: '#password'
      },
      role:{
        required: true
      },
      banner_name: {
        required: true
      },
      username: {
        required: true
      },
      designation: {
        required: true
      },
      place: {
        required: true
      },
      mobile: {
        maxlength: 10,
        minlength: 10,
	      required: true
      },
      location_address: {
        required: true
      },
      city_name: {
        required: true
      },
      region_name: {
        required: true
      },
      country_name: {
        required: true
      }
	  },
    success: (element) => {
      element
      .text('OK!')
      .addClass('valid');
    }
  });
});
