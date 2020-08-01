const moment = require('moment');

module.exports = {
  run: async () => {
    const currentDate = new Date();
    const dateFormate = moment(currentDate).format('D/M/YYYY');
    const currentStartTimeMinute = moment(currentDate).format('mm');
    const nextEndTime = moment(currentDate).add(2, 'minutes');
    const nextEndTimeMinute = moment(nextEndTime).format('mm');
    const timeslotsData = await Timeslot.find({ 'is_paid': true });

    let activeTimeslotsArray = [];
    let temp = 0;

    for (let index = 0; index < timeslotsData.length; index++) {
      if (timeslotsData.date === dateFormate) {
        activeTimeslotsArray[temp] = timeslotsData[index];
        temp++;
      }
    }

    let currentActiveTimeslotsArray = [];
    let temp2 = 0;

    for (let index = 0; index < activeTimeslotsArray.length; index++) {
      if (activeTimeslotsArray[index].time_from >= currentStartTimeMinute && activeTimeslotsArray[index].time_from < nextEndTimeMinute) {
        currentActiveTimeslotsArray[temp2] = activeTimeslotsArray[index];
        temp2++;
      }
    }

    if (temp2 > 0) {
      const lengthOfData = currentActiveTimeslotsArray.length;

      for (let index = 0; index < lengthOfData; index++) {
        let INSERT_QUERY =
        `
        INSERT INTO
          log
        (createdAt, updatedAt, banner_id, timeslot_id)
        VALUES
          ($1, $2, $3, $4)
        `;

        await sails.sendNativeQuery(
          INSERT_QUERY,
          [
            Date.now(),
            Date.now(),
            currentActiveTimeslotsArray[index].banner_id,
            currentActiveTimeslotsArray[index].id
          ]
        );
      }
    } else {
      console.log('Checking...');
    }
  }
};
