module.exports = function HandleResponse (optionalData, optinalMessage = 'Request completed successfully') {

  let { res } = this;

  let statusCodeToSet = 400;

  let result = {
    status: false,
    message: '',
    error: {},
    data: null,
  };
  if (optionalData === undefined) {
    // sails.log.info('Ran custom response: res.HandleResponse()');
    return res.sendStatus(statusCodeToSet);
  }
  else if (_.isError(optionalData)) {
    // sails.log.info('Custom response `res.HandleResponse()` called with an Error:', optionalData);

    if (!_.isFunction(optionalData.toJSON)) {
      if (optionalData.name === 'ValidationError'){
        result.message = optionalData.details[0].message;
      } else {
        result.message = optionalData['message'];
      }
      return res.status(statusCodeToSet).send(result);
    }
  }
  else if (optionalData.code){
    result.message = optionalData.message;
    return res.status(statusCodeToSet).send(result);
  }
  else if (optionalData === 'Error') {
    result.message = optinalMessage;
    return res.status(statusCodeToSet).send(result);
  }
  else {
    if (optinalMessage === false) {
      if ( typeof optionalData === 'string' ) {
        result.message = optionalData;
      } else {
        result.message = optionalData.message;
      }

      return res.status(statusCodeToSet).send(result);
    } else {
      statusCodeToSet = 200;
      result.status = true;
      result.data = optionalData;
      result.message = optinalMessage;
      return res.status(statusCodeToSet).send(result);
    }
  }
};
