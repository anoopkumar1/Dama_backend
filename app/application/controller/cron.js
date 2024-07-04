/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  :
 * Description :
 * Modified By :
 */
const cronModel = require("../model/cron-model");

let cronObj = {};

/**
 * This function is send  notification reminders
 * @param     :
 * @returns   :
 * @developer :
 */
cronObj.sendDailyNotification = async function () {
  let result = await cronModel.sendDailyNotification();

  if (result) {
    return true;
  } else {
    return false;
  }
};

module.exports = cronObj;
