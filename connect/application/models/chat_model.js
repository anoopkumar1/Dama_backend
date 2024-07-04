/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Diksha Jaswal <dikshaj.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */

const q = require("q"),
  helper = require("../helpers"),
  mongoHelper = require("../helpers/mongo_helper"),
  { v4 } = require("uuid");

let chatModelObj = {};

/** This Function is used to save one to chat
 *
 * @developer :
 * @modified  :
 */
chatModelObj.saveOneToOneChat = async function (dataObj) {
  let deferred = q.defer();

  if (dataObj && dataObj.conversationId) {
    let saveChat = await chatModelObj.saveChatFunctionOneToOne(dataObj);

    if (saveChat && saveChat > 0) {
      deferred.resolve(saveChat);
    } else {
      deferred.resolve(0);
    }
  } else {
    deferred.resolve(0);
  }

  return deferred.promise;
};

/**
 *
 * @developer :
 * @modified  :
 */
chatModelObj.saveChatFunctionOneToOne = async function (dataObj) {
  let deferred = q.defer();
  let deliverStatus = await helper.deliverStatus(
    dataObj.userId,
    dataObj.receiverId
  );
  let tableName = `users_conversation_details`,
    insertValue = {
      ucd_uuid: v4(Date.now()),
      ucd_fk_uc_uuid: dataObj.conversationId,
      ucd_fk_sender_uc_uuid: dataObj.userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_deliver_status: deliverStatus,
      ucd_type: "TEXT",
      ucd_message: dataObj.message,
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(unseenCount.length);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

module.exports = chatModelObj;
