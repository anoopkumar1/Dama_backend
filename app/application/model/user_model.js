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

const q = require("q"),
  helper = require("../helpers/index"),
  { v4 } = require("uuid");
const mongoHelper = require("../helpers/mongo_helper");

const userModel = {};

/**
 *
 *This model is using to get the user login data
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
userModel.getLoginUsersData = async function (userId) {
  let deferred = q.defer();

  if (userId) {
    let selectObj = {
      uc_uuid: userId,
      uc_deleted: "0",
      uc_active: "1",
    };
    let users_data = await mongoHelper.getData(selectObj, "users_credential");

    if (users_data && users_data.length > 0) {
      deferred.resolve(users_data[0]);
    } else {
      deferred.resolve({});
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * for update notification setting
 * @param   :
 * @developer   : Manjeet Thakur
 */
userModel.updateNotificationSetting = async (userId) => {
  try {
    let updateobj;
    let searchObj = {
      uc_uuid: userId,
    };

    let getdata = await mongoHelper.getData(searchObj, "users_credential");
    if (getdata) {
      let setting = getdata[0].uc_notificationSetting;

      if (setting === "0") {
        updateobj = {
          uc_notificationSetting: "1",
        };
      } else {
        updateobj = {
          uc_notificationSetting: "0",
        };
      }
      let result = await mongoHelper.updateData(
        searchObj,
        "users_credential",
        updateobj
      );
      if (result) {
        return result;
      } else {
        return false;
      }
    }
  } catch (error) {
    return false;
  }
};

/**
 *
 * This function is using to get the other user data
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
userModel.getOtherUserId = async function (userId) {
  let deferred = q.defer();
  let result = await mongoHelper.getData(
    { uc_uuid: userId },
    "users_credential"
  );
  deferred.resolve(result);
  return deferred.promise;
};

/**
 * This function used to get the privacy policy and term and conditions
 * @param     :
 * @returns   :
 * @developer :Anoop kumar
 */

userModel.getContent = async function (body, type) {
  let deferred = q.defer();
  if (body && type) {
    let obj = {
      dc_deleted: "0",
      dc_type: type,
    };

    try {
      let profileData = await mongoHelper.getData(obj, "dama_content");
      if (profileData.length > 0) {
        deferred.resolve(profileData[0]);
      } else {
        deferred.resolve(false);
      }
    } catch (error) {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};


/**
 * for get  about us content
 * @param   :
 * @developer   : Manjeet Thakur
 */
userModel.getAboutContent = async () => {
  try {
    let searchObj = {
      a_deleted: "0",
    };
    let result = await mongoHelper.getData(searchObj, "about_us_content");
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
module.exports = userModel;
