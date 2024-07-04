/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.

 *
 * Written By  : Anoop kumar <anoop.zeroit@gmail.com>, june 2024
 * Description :
 * Modified By :
 */

const q = require("q"),
  helper = require("../helpers/index"),
  { v4 } = require("uuid"),
  constants = require("../../../common/config/constants"),
  _commonModel = require("../model/common_model"),
  ffmpeg = require("fluent-ffmpeg"),
  ThumbnailGenerator = require("video-thumbnail-generator").default;
const {
  deleteData,
} = require("../../../connect/application/helpers/mongo_helper");
const mongoHelper = require("../helpers/mongo_helper");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const chatModel = {};

/**
 * This function is used to upload image in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatModel.uploadChatIMAGE = async function (userId, dataObj, fName) {
  let deferred = q.defer();
  let deliverStatus = await helper.deliverStatus(userId, dataObj.receiverId);
  let tableName = `users_conversation_details`,
    insertValue = {
      ucd_uuid: v4(Date.now()),
      ucd_fk_uc_uuid: dataObj.conversationId,
      ucd_fk_sender_uc_uuid: userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_deliver_status: deliverStatus,
      ucd_image: fName,
      ucd_type: "IMAGE",
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_uc_uuid: dataObj.conversationId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is used to upload video in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatModel.uploadChatVideo = async function (userId, dataObj, fName) {
  let deferred = q.defer();
  let deliverStatus = await helper.deliverStatus(userId, dataObj.receiverId);
  let tableName = `-------------------------`,
    insertValue = {
      ucd_uuid: dataObj.uuId,
      ucd_fk_uc_uuid: dataObj.conversationId,
      ucd_fk_sender_uc_uuid: userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_deliver_status: deliverStatus,
      ucd_video: fName,
      ucd_thumbnail: "",
      ucd_type: "video",
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is used to upload pdf in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatModel.uploadChatPdf = async function (userId, dataObj, fName) {
  let deferred = q.defer();
  let deliverStatus = await helper.deliverStatus(userId, dataObj.receiverId);
  let tableName = `users_conversation_details`,
    insertValue = {
      ucd_uuid: dataObj.uuId,
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_sender_uc_uuid: userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_deliver_status: deliverStatus,
      ucd_pdf: fName,
      ucd_type: "pdf",
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is used to upload Thumbnail in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatModel.uploadThumbnail = async function (userId, fields, fName) {
  let deferred = q.defer();
  if (userId) {
    selectObj1 = {
      ucd_uuid: fields.uuId,
    };
    updateObj = {
      ucd_thumbnail: fName,
    };

    let updateData = await mongoHelper.updateData(
      selectObj1,
      "users_conversation_details",
      updateObj
    );
    if (updateData) {
      deferred.resolve(true);
    } else {
      deferred.resolve(true);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is used to upload doc in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatModel.uploadChatdoc = async function (userId, dataObj, fName) {
  let deferred = q.defer();
  let deliverStatus = await helper.deliverStatus(userId, dataObj.receiverId);
  let tableName = `users_conversation_details`,
    insertValue = {
      ucd_uuid: dataObj.uuId,
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_sender_uc_uuid: userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_deliver_status: deliverStatus,
      ucd_doc: fName,
      ucd_type: "doc",
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is using get the chatlist
 * @param     :
 * @returns   :
 * @developer :Anoop
 */

chatModel.chatList = async function (userId, conversationId) {
  let deferred = q.defer();

  console.log("Starting chatList function");
  console.log("userId:", userId);
  console.log("conversationId:", conversationId);

  if (userId && conversationId) {
    let selectorderObj = {
      usc_uuid: conversationId,
    };
    console.log("selectorderObj:", selectorderObj);

    let usersData = await mongoHelper.getData(
      selectorderObj,
      "users_conversation"
    );
    console.log("usersData:", usersData);

    if (usersData && usersData.length > 0) {
      let otherUserId = "";
      if (usersData[0].usc_other_fk_uc_uuid != userId) {
        otherUserId = usersData[0].usc_other_fk_uc_uuid;
      } else {
        otherUserId = usersData[0].usc_fk_uc_uuid;
      }
      console.log("otherUserId:", otherUserId);

      if (usersData[0].uc_deleted_user_id == userId) {
        await mongoHelper.updateData(selectorderObj, "users_conversation", {
          usc_deleted_status: "0",
          usc_deleted_user_id: "",
        });
      }

      // let selectblockUserObj = {
      //   usb_block_fk_uc_uuid: otherUserId,
      //   usb_fk_uc_uuid: userId,
      // };
      // console.log("selectblockUserObj:", selectblockUserObj);

      // let blockUserData = await mongoHelper.getData(
      //   selectblockUserObj,
      //   "users_block"
      // );
      // console.log("blockUserData:", blockUserData);

      // let loginUserBlock = {
      //   usb_block_fk_uc_uuid: userId,
      //   usb_fk_uc_uuid: otherUserId,
      // };
      // let blockData = await mongoHelper.getData(loginUserBlock, "users_block");
      // console.log("blockData:", blockData);

      // let blockStatus = "0";
      // let loginUserBlockStatus = "0";

      // if (blockUserData.length > 0) {
      //   blockStatus = "1";
      // }
      // if (blockData.length > 0) {
      //   loginUserBlockStatus = "1";
      // }
      // console.log("blockStatus:", blockStatus);
      // console.log("loginUserBlockStatus:", loginUserBlockStatus);

      let selectObj = {
        ucd_fk_usc_uuid: conversationId,
        ucd_deleted: "0",
        ucd_deleted_user_id: { $ne: userId },
      };
      console.log("selectObj:", selectObj);

      let orderData = await mongoHelper.getUsersConversationDetails(
        selectObj,
        "users_conversation_details"
      );
      console.log("orderData:", orderData);

      let selectObj2 = {
        ucd_fk_uc_uuid: conversationId,
        ucd_fk_receiver_uc_uuid: userId,
        ucd_seen: "0",
      };
      let updateObj = {
        ucd_seen: "1",
      };
      await mongoHelper.updateManyData(
        selectObj2,
        "users_conversation_details",
        updateObj
      );

      let anotherUserId = usersData[0].usc_other_fk_uc_uuid;
      console.log("anotherUserId:", anotherUserId);

      let getObj = {
        ucd_fk_receiver_uc_uuid: userId,
        ucd_seen: "0",
      };
      console.log("getObj:", getObj);

      let unseenCount = await mongoHelper.getData(
        getObj,
        "users_conversation_details"
      );
      console.log("unseenCount:", unseenCount);
      _commonModel.sendChatCount(userId, unseenCount.length);

      let selectObjone = {
        usc_uuid: anotherUserId,
      };
      console.log("selectObjone:", selectObjone);

      let orderDataone = await mongoHelper.getData(
        selectObjone,
        "users_credential"
      );
      console.log("orderDataone:", orderDataone);

      if (orderDataone && orderDataone.length > 0) {
        orderData.uc_image = orderDataone[0].usc_profileImage;
        orderData.uc_name =
          orderDataone[0].usc_first_name + " " + orderDataone[0].usc_last_name;
      }

      // orderData.blockStatus = blockStatus;
      // orderData.loginUserBlockStatus = loginUserBlockStatus;
      console.log("Final orderData:", orderData);

      deferred.resolve(orderData);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  console.log("End of chatList function");
  return deferred.promise;
};

/**
 * This function is using to upload chat
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
chatModel.uploadChatAudio = async function (userId, dataObj, fName, duration) {
  let deferred = q.defer();
  let deliverStatus = helper.deliverStatus(userId, dataObj.receiverId);
  let tableName = `users_conversation_details`,
    insertValue = {
      ucd_uuid: v4(Date.now()),
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_sender_uc_uuid: userId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_deleted: "0",
      ucd_deliver_status: deliverStatus,
      ucd_seen: "0",
      ucd_deleted_status: "0",
      ucd_deleted_user_id: "",
      ucd_audio: fName,
      ucd_audio_duration: duration,
      ucd_type: "AUDIO",
      ucd_created_at: await helper.getUtcTime(),
    };

  let insertData = await mongoHelper.insert(insertValue, tableName);

  if (insertData) {
    let selectObj = {
      ucd_fk_uc_uuid: dataObj.orderDetailId,
      ucd_fk_receiver_uc_uuid: dataObj.receiverId,
      ucd_seen: "0",
    };

    let unseenCount = await mongoHelper.getData(selectObj, tableName);

    deferred.resolve(true);
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is using get the add User Like
 * @param     :
 * @returns   :
 * @developer :Anoop
 */

chatModel.addUserConversation = async function (userId, otherUserId) {
  let deferred = q.defer();

  if (userId && otherUserId) {
    let selectObj = {
      $or: [
        { usc_fk_uc_uuid: userId, usc_other_fk_uc_uuid: otherUserId },
        { usc_fk_uc_uuid: otherUserId, usc_other_fk_uc_uuid: userId },
      ],
    };

    try {
      let res = await mongoHelper.getData(selectObj, "users_conversation");

      if (res.length <= 0) {
        let date = await helper.getUtcTime();
        let insertObj = {
          usc_uuid: v4(Date.now()),
          usc_fk_uc_uuid: userId,
          usc_other_fk_uc_uuid: otherUserId,
          usc_deleted_status: "0",
          usc_created: date,
          usc_updated: date,
        };

        let result = await mongoHelper.insert(insertObj, "users_conversation");
        console.log(result);
        deferred.resolve(result);
      } else {
        console.log("executed");
        if (res[0].usc_deleted_user_id === userId) {
          let updateObj = {
            usc_deleted_user_id: "",
            usc_deleted_status: "0",
          };
          let result1 = await mongoHelper.updateData(
            selectObj,
            "users_conversation",
            updateObj
          );
          if (result1) {
            deferred.resolve(result1);
          } else {
            deferred.resolve(false);
          }
        } else {
          deferred.resolve(res);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This model is using to get the users login data
 * @param     :
 * @returns   :
 * @developer :Anoop
 */

chatModel.getMessage = async function (userId, conversationId) {
  let deferred = q.defer();

  try {
    if (userId && conversationId) {
      let newArray = [];

      let conversationDetailsObj = {
        ucd_fk_uc_uuid: conversationId,
      };

      let conversactionData = await mongoHelper.getData(
        conversationDetailsObj,
        "users_conversation_details"
      );

      if (conversactionData && conversactionData.length > 0) {
        // for (const res1 of conversactionData) {
        //   let obj = {};
        //   obj.ucd_message = res1.ucd_message;
        //   obj.ucd_created_at = res1.ucd_created_at;
        //   newArray.push(obj);
        // }

        // conversactionData[0].user_chat_array = newArray;
        deferred.resolve(conversactionData);
      } else {
        deferred.resolve([]);
      }
    } else {
      deferred.resolve(false);
    }
  } catch (error) {
    deferred.reject(error);
  }

  return deferred.promise;
};



/**
 * for get all chat user list
 * @param   :
 * @developer   : Manjeet Thakur
 */
// chatModel.getAllUserChatListOld = async (userId) => {
//   try {
//     let searchObj = {
//       usc_fk_uc_uuid: userId,
//       usc_deleted_status: "0",
//     };
//     console.log("searchObj:", searchObj);

//     let searchData = await mongoHelper.getData(searchObj, "users_conversation");
//     console.log("searchData:", searchData);

//     if (searchData && searchData.length > 0) {
//       for (let i = 0; i < searchData.length; i++) {
//         let conversation = searchData[i];
//         let otherUserId = conversation.usc_other_fk_uc_uuid;
//         console.log(
//           `Processing conversation ${i} with otherUserId:`,
//           otherUserId
//         );

//         let conversationDetailsObj = {
//           $or: [
//             {
//               ucd_fk_sender_uc_uuid: otherUserId,
//               ucd_fk_receiver_uc_uuid: userId,
//             },
//             {
//               ucd_fk_sender_uc_uuid: userId,
//               ucd_fk_receiver_uc_uuid: otherUserId,
//             },
//           ],
//         };
//         console.log("conversationDetailsObj:", conversationDetailsObj);

//         let result = await mongoHelper.getData(
//           conversationDetailsObj,
//           "users_conversation_details"
//         );
//         console.log("conversation details result:", result);

//         let senderUserId = result[0].ucd_fk_sender_uc_uuid || "";
//         console.log("senderUserId:", senderUserId);

//         let userCredentialObj = {
//           uc_uuid: senderUserId,
//           uc_deleted: "0",
//         };
//         console.log("userCredentialObj:", userCredentialObj);

//         let userData = await mongoHelper.getData(
//           userCredentialObj,
//           "users_credential"
//         );
//         console.log("userData:", userData);

//         if (userData && userData.length > 0) {
//           let lastMessage = await mongoHelper.getLastMessage(
//             conversationDetailsObj,
//             "users_conversation_details"
//           );
//           console.log("lastMessage:", lastMessage);

//           searchData[
//             i
//           ].name = `${userData[0].uc_first_name} ${userData[0].uc_last_name}`;
//           searchData[i].image = userData[0].uc_profie_image || "";
//           searchData[i].date = result[0].ucd_created_at;
//           searchData[i].otherUserId = result[0].ucd_fk_sender_uc_uuid;
//           searchData[i].lastMessage =
//             lastMessage && lastMessage.length > 0
//               ? lastMessage[0].ucd_message
//               : "dummy message";
//         } else {
//           console.log("User data not found or user deleted.");
//           return false;
//         }
//       }
//       return searchData;
//     } else {
//       console.log("No conversations found.");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error in getAllUserChatList:", error);
//     throw error;
//   }
// };


/**
 * for get all chat user list
 * @param   :
 * @developer   : 
 */
chatModel.getAllUserChatList = async function (userId) {

  let deferred = q.defer();

  if (userId) {
    let newArray = [];
    let obj1 = {
        $or: [
          {
            usc_fk_uc_uuid: userId,
            usc_deleted_user_id: { $ne: userId },
          },
          {
            usc_other_fk_uc_uuid: userId,
            usc_deleted_user_id: { $ne: userId },
          },
        ],
      },
      res = await mongoHelper.getData(obj1, "users_conversation");
    let myObj = {
      uc_uuid: userId,
    };
    let mylogin = await mongoHelper.getData(myObj, "users_credential");

    if (res.length > 0) {
      for (const result of res) {
        let lastMsgObj = {
          ucd_fk_uc_uuid: result.usc_uuid,
          ucd_deliver_status: "1",
        };
        let lastMsgData = await mongoHelper.getLastId(
          lastMsgObj,
          "users_conversation_details"
        );

        result.last_msg =
          lastMsgData.length > 0 ? lastMsgData[0].ucd_message : "";
        result.last_msg_type =
          lastMsgData.length > 0 ? lastMsgData[0].ucd_type : "";
        result.usc_created =
          lastMsgData.length > 0
            ? lastMsgData[0].ucd_created_at
            : result.usc_created;

        let dObj = {
          ucd_fk_receiver_uc_uuid: userId,
          ucd_fk_uc_uuid: result.usc_uuid,
          ucd_seen: "0",
        };

        let detailCount = await mongoHelper.getData(
          dObj,
          "users_conversation_details"
        );

        let countSeen = detailCount.length;
        result.uc_countSeen = countSeen;

        let objs = {};
        if (result.usc_other_fk_uc_uuid == userId) {
          objs = {
            uc_uuid: result.usc_fk_uc_uuid,
          };
        } else {
          objs = {
            uc_uuid: result.usc_other_fk_uc_uuid,
          };
        }
        let res1 = await mongoHelper.getData(objs, "users_credential");
        console.log(res1,"res1res1res1res1res1res1res1")
        if (res1.length > 0) {
          let name = res1[0].uc_first_name + ' '+ res1[0].uc_last_name;
       
         
          // let image = res2.usd_user_image_one?res2.usd_user_image_one:"";
          // result.uc_image = image;
          // result.uc_name = name;

          let image =
          res1[0].uc_profie_image;
          result.uc_image = image ? image : "";
          result.uc_name = name;

        
          newArray.push(result);
          
        }
      }
      deferred.resolve(newArray);
    } else {
      deferred.resolve([]);
    }
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

/**
 * for update message seen status
 * @param   :
 * @developer   : Manjeet Thakur
 */
chatModel.updateSeenStatus = async (userId, conversationId) => {
  try {
    let searchObj = {
      usc_uuid: conversationId,
    };

    let getConversationData = await mongoHelper.getData(
      searchObj,
      "users_conversation"
    );
    console.log("getConversationData:", getConversationData);

    if (getConversationData && getConversationData.length > 0) {
      let senderId = getConversationData[0].usc_other_fk_uc_uuid;
      console.log("senderId:", senderId);

      if (senderId === userId) {
        console.log("Sender is the same as userId, returning empty array.");
        return [];
      }

      let selectObj = {
        $or: [
          { ucd_fk_sender_uc_uuid: senderId },
          { ucd_fk_receiver_uc_uuid: senderId },
        ],
      };
      console.log("selectObj:", selectObj);

      let updateObj = {
        ucd_seen: "1",
      };
      console.log("updateObj:", updateObj);

      let updateData = await mongoHelper.updateManyData(
        selectObj,
        "users_conversation_details",
        updateObj
      );
      console.log("updateData:", updateData);

      return updateData || false;
    } else {
      console.log("No conversation data found or invalid conversation ID.");
      return false;
    }
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};

/**
 * for get all unread chat list
 * @param   :
 * @developer   : Manjeet Thakur
 */
chatModel.getUnreadChatList = async (userId) => {
  try {
    let searchObj = {
      usc_fk_uc_uuid: userId,
      usc_deleted_status: "0",
    };

    let searchData = await mongoHelper.getData(searchObj, "users_conversation");

    if (searchData && searchData.length > 0) {
      for (let i = 0; i < searchData.length; i++) {
        let conversation = searchData[i];
        let otherUserId = conversation.usc_other_fk_uc_uuid;

        let conversationDetailsObj = {
          $or: [
            {
              ucd_fk_sender_uc_uuid: otherUserId,
              ucd_fk_receiver_uc_uuid: userId,
            },
            {
              ucd_fk_sender_uc_uuid: userId,
              ucd_fk_receiver_uc_uuid: otherUserId,
            },
          ],
        };

        let result = await mongoHelper.getData(
          conversationDetailsObj,
          "users_conversation_details"
        );

        if (result && result.length > 0) {
          let senderUserId = result[0].ucd_fk_sender_uc_uuid;

          let userCredentialObj = {
            uc_uuid: senderUserId,
            uc_deleted: "0",
          };

          let userData = await mongoHelper.getData(
            userCredentialObj,
            "users_credential"
          );

          if (userData && userData.length > 0) {
            let lastMessage = await mongoHelper.getLastMessage(
              conversationDetailsObj,
              "users_conversation_details"
            );

            searchData[
              i
            ].name = `${userData[0].uc_first_name} ${userData[0].uc_last_name}`;
            searchData[i].image = userData[0].uc_profie_image || "";
            searchData[i].date = result[0].ucd_created_at;
            searchData[i].otherUserId = result[0].ucd_fk_sender_uc_uuid;

            if (lastMessage) {
              searchData[i].lastMessage =
                lastMessage && lastMessage.length > 0
                  ? lastMessage[0].ucd_message
                  : "dummy message";
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      return searchData;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in getAllUserChatList:", error);
    throw error;
  }
};

module.exports = chatModel;
