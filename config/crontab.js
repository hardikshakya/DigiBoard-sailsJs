module.exports.crontab = {
  crons: () => {
    const jsonArray = [];

    jsonArray.push({
      interval:'*/2 * * * * ',
      method:'addIntoLog'
    });

    return jsonArray;
  },

  addIntoLog: () => {
    require('../crontab/add_into_log.js').run();
  }
};
