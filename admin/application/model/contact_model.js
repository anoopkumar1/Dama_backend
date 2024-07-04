/**
 *
 * Written By  : anoop kumar <mailto:anoop.zeroit@gmail.com>, septmber 2023
 * Description :
 * Modified By :
 */
const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");

const contactModel = {};
/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
contactModel.insertContact = async function (body) {
  let deferred = q.defer();
  if (body.userMessage && body.contentType) {
    let date = await helper.getUtcTime();
    let insertObj = {
      dc_uuid: v4(Date.now()),
      dc_message: body.userMessage,
      dc_type: body.contentType,
      dc_active: "1",
      dc_deleted: "0",
      dc_created: date,
    };

    let results = await mongoHelper.insert(insertObj, "dama_content");

    if (results) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer :
 */
contactModel.deleteContact = async function (body) {
  let deferred = q.defer();

  if (body.userId) {
    let selectObj = {
      dc_uuid: body.userId,
    };
    let updateObj = {
      dc_deleted: "1",
    },
      result = await mongoHelper.updateData(
        selectObj,
        "dama_content",
        updateObj
      );

    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};


/**
 * This function is using for get keys list
 * @param     :
 * @returns   :
 * @developer :
 */
contactModel.getcontactList = async function (body) {
  let deferred = q.defer();
  let obj = {
    dc_deleted: "0",
  };

  let userArray = await mongoHelper.getcontactListData(obj, "dama_content", body);
  if (userArray && userArray.data && userArray.data.length > 0) {
    for (const result of userArray.data) {

      result.dc_created = helper.dateFormat(result.dc_created, "date");

      let adminObj = {
        dc_uuid: result.dc_fk_au_uuid,
      };

      let adminData = await mongoHelper.getData(adminObj, "admin_users");

      if (adminData && adminData.length > 0) {
        result.admin_name = adminData[0].dc_name;
      }
    }

    deferred.resolve(userArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};


/**
 * This function is using
 * @param      :
 * @returns    :
 * @developer  :
 */
contactModel.editContact = async function (body) {
  let deferred = q.defer();
  if (body.userId) {

    let selectObj = {
      dc_uuid: body.userId
    };
    let updateObj = {
      dc_message: body.userMessage,
      dc_type: body.contentType,
    };
    let result = await mongoHelper.updateData(selectObj, "dama_content", updateObj);
    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }

  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

module.exports = contactModel;

