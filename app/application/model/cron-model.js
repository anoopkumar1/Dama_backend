/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Manjeet <manjeet@zeroitsolutions.com>, june 2024
 * Description :
 * Modified By :
 */
const q = require("q"),
  helper = require("../helpers/index"),
  _commonModel = require("../model/common_model"),
  mongoHelper = require("../helpers/mongo_helper");

const cronModel = {};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer :
 */
cronModel.sendDailyNotification = async function () {
  // console.log("executed");
  let currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  let deferred = q.defer();
  let eventData = await mongoHelper.getData({}, "event_booking");
  if (eventData && eventData.length > 0) {
    // console.log(eventData, "goalData------------------------------");

    for (i = 0; i < eventData.length; i++) {
      let eventId = eventData[0].e_id;
      let data = await mongoHelper.getData({ e_uuid: eventId }, "event");
      if (data && data.length > 0) {
        let eventEndDate = data[0].e_endDate;
        if (eventEndDate < formattedDate) {
          let searchObj = {
            ud_fk_uc_uuid: eventData[0].e_uc_id,
          };
          let getData = await mongoHelper.getData(searchObj, "users_devices");
          if (getData && getData.length > 0 && getData[0].ud_token) {
            let array = [getData[0].ud_token];
            let title = "Event reminder";
            let message = `Attend the event ${data[0].e_title} on ${data[0].e_startDate}`;
            let result = await cronModel.sendNotificationToUser(
              array,
              message,
              title
            );
            if (result) {
              // console.log("Notification sent successfully");
              return true;
            }
          }
        }
      }
    }

    deferred.resolve(true);
  }

  return deferred.promise;
};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer :
 */
cronModel.sendNotificationToUser = async function (token, message, title) {
  let deferred = q.defer();
  // console.log(token, "Token---------------------");
  // console.log(message, "message---------------------");
  if (token) {
    let array = [];

    array.push(token);

    let messageObj = {
      notification: {
        title: title,
        body: message,
        sound: "notification.wav",
        badge: "1",
        priority: "high",
        android_channel_id: "high_importance_channel",
      },
      data: {
        title: title,
        score: "850",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },

      registration_ids: array,
    };

    _commonModel.sendNotificationFCM(messageObj);
    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

module.exports = cronModel;
