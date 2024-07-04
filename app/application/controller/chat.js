/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  : anoop <anoop.zeroit@gmail.com>, June 2024
 * Description :
 * Modified By :
 */

const { exit } = require("process");
const helper = require("../helpers/index"),
  fs = require("fs"),
  path = require("path"),
  Busboy = require("busboy"),
  mongoHelper = require("../helpers/mongo_helper"),
  constants = require("../../../common/config/constants"),
  commonModel = require("../model/common_model");
const AWS = require("aws-sdk");
const chatModel = require("../model/chat_model");
AWS.config.update({ region: "us-east-1" });
let chatObj = {};

/**
 * This function is used to upload image in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatObj.uploadChatImage = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        let image = await chatModel.uploadChatIMAGE(userId, fields, fName);
        let socketSendData = {
          action: "CON-MESSAGE",
          data: {
            conversationId: fields.conversationId,
          },
        };

        io.to(fields.conversationId).emit("call", socketSendData);

        let userToken = {
          uc_fk_uc_uuid: fields.receiverId,
        };

        let userData = await mongoHelper.getData(
          userToken,
          "users_connections"
        );

        if (userData && userData.length > 0) {
          let array = [];

          array.push(userData[0].uc_fcm_token);

          let messageObj = {
            notification: {
              title: "New Message",
              body: "Audio",
              sound: "notification.wav",
              badge: "1",
              priority: "high",
              android_channel_id: "high_importance_channel",
            },
            data: {
              title: "New Message",
              score: "850",
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },

            registration_ids: array,
          };

          commonModel.sendNotificationFCM(messageObj, fields.receiverId);
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);
  } else {
    let obj = {
      status: false,
      code: "UPI-E1001",
      message: "Unauthorized Error.",
    };
    helper.errorHandler(res, obj, 401);
  }
};

/**
 * This function is used to upload video in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatObj.uploadChatVideo = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        let image = await chatModel.uploadChatVideo(userId, fields, fName);
        let socketSendData = {
          action: "CON-MESSAGE",
          data: {
            conversationId: fields.conversationId,
            uuId: fields.uuId,
          },
        };

        io.to(fields.conversationId).emit("call", socketSendData);

        let userToken = {
          uc_fk_uc_uuid: fields.receiverId,
        };

        let userData = await mongoHelper.getData(
          userToken,
          "users_connections"
        );

        if (userData && userData.length > 0) {
          let array = [];

          array.push(userData[0].uc_fcm_token);

          let messageObj = {
            notification: {
              title: "New Message",
              body: "Audio",
              sound: "notification.wav",
              badge: "1",
              priority: "high",
              android_channel_id: "high_importance_channel",
            },
            data: {
              title: "New Message",
              score: "850",
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },

            registration_ids: array,
          };

          commonModel.sendNotificationFCM(messageObj, fields.receiverId);
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);
  } else {
    let obj = {
      status: false,
      code: "UPI-E1001",
      message: "Unauthorized Error.",
    };
    helper.errorHandler(res, obj, 401);
  }
};

/**
 * This function is used to upload pdf in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatObj.uploadChatPdf = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        let image = await chatModel.uploadChatPdf(userId, fields, fName);
        let socketSendData = {
          action: "CON-MESSAGE",
          data: {
            conversationId: fields.conversationId,
            uuId: fields.uuId,
          },
        };

        io.to(fields.conversationId).emit("call", socketSendData);

        let userToken = {
          uc_fk_uc_uuid: fields.receiverId,
        };

        let userData = await mongoHelper.getData(
          userToken,
          "users_connections"
        );

        if (userData && userData.length > 0) {
          let array = [];

          array.push(userData[0].uc_fcm_token);

          let messageObj = {
            notification: {
              title: "New Message",
              body: "Audio",
              sound: "notification.wav",
              badge: "1",
              priority: "high",
              android_channel_id: "high_importance_channel",
            },
            data: {
              title: "New Message",
              score: "850",
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },

            registration_ids: array,
          };

          commonModel.sendNotificationFCM(messageObj, fields.receiverId);
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);
  } else {
    let obj = {
      status: false,
      code: "UPI-E1001",
      message: "Unauthorized Error.",
    };
    helper.errorHandler(res, obj, 401);
  }
};

/**
 * This function is used to upload Thumbnail in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatObj.uploadThumbnail = async function (req, res) {
  let userId = helper.getUUIDByToken(req);

  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};
      if (returnObj) {
        let image = await chatModel.uploadThumbnail(userId, fields, fName);

        if (image) {
          let returnRes = "";

          if (returnObj.Location) {
            returnRes = returnObj.Location;
          }
          obj.payload = returnRes;
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);

    return req.pipe(busboy);
  } else {
    helper.errorHandler(
      res,
      {
        code: "AK-E1000",
        message: "Unauthorized Error.",
        status: false,
      },
      200
    );
  }
};

/**
 * This function is used to upload doc in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer :Anoop
 */
chatObj.uploadChatdoc = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        let image = await chatModel.uploadChatdoc(userId, fields, fName);
        let socketSendData = {
          action: "CON-MESSAGE",
          data: {
            conversationId: fields.conversationId,
            uuId: fields.uuId,
          },
        };

        io.to(fields.conversationId).emit("call", socketSendData);

        let userToken = {
          uc_fk_uc_uuid: fields.receiverId,
        };

        let userData = await mongoHelper.getData(
          userToken,
          "users_connections"
        );

        if (userData && userData.length > 0) {
          let array = [];

          array.push(userData[0].uc_fcm_token);

          let messageObj = {
            notification: {
              title: "New Message",
              body: "Audio",
              sound: "notification.wav",
              badge: "1",
              priority: "high",
              android_channel_id: "high_importance_channel",
            },
            data: {
              title: "New Message",
              score: "850",
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },

            registration_ids: array,
          };

          commonModel.sendNotificationFCM(messageObj, fields.receiverId);
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);
  } else {
    let obj = {
      status: false,
      code: "UPI-E1001",
      message: "Unauthorized Error.",
    };
    helper.errorHandler(res, obj, 401);
  }
};

/**
 * This function is using to get the chatlist
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
chatObj.chatList = async function (req, res) {
  let userId = helper.getUUIDByToken(req);

  if (userId) {
    let data = await chatModel.chatList(userId, req.body.conversationId);

    if (data) {
      helper.successHandler(res, {
        payload: data,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "AK-E1000",
      message: "Failed, Please try again.",
      status: false,
    });
  }
};

/**
 * This function is using to upload chat
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
chatObj.uploadChatAudio = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      let newName = Date.now() + ext;

      fName = newName.replace(/ /g, "_");
      fType = mimetype;
      fEncoding = encoding;

      file.on("data", function (data) {
        chunks.push(data);
      });

      file.on("end", function () {});
    });

    busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.CHAT_MEDIA_FOLDER,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        let duration = fields.duration;
        await chatModel.uploadChatAudio(userId, fields, fName, duration);
        let socketSendData = {
          action: "CON-MESSAGE",
          data: {
            conversationId: fields.conversationId,
          },
        };

        io.to(fields.conversationId).emit("call", socketSendData);

        let userToken = {
          uc_fk_uc_uuid: fields.receiverId,
        };

        let userData = await mongoHelper.getData(
          userToken,
          "users_connections"
        );

        if (userData && userData.length > 0) {
          let array = [];

          array.push(userData[0].uc_fcm_token);

          let messageObj = {
            notification: {
              title: "New Message",
              body: "Audio",
              sound: "notification.wav",
              badge: "1",
              priority: "high",
              android_channel_id: "high_importance_channel",
            },
            data: {
              title: "New Message",
              score: "850",
              click_action: "FLUTTER_NOTIFICATION_CLICK",
            },

            registration_ids: array,
          };

          commonModel.sendNotificationFCM(messageObj, fields.receiverId);
        }
        chunks.push(obj);
      }
      helper.successHandler(res, obj);
    });

    return req.pipe(busboy);
  } else {
    let obj = {
      status: false,
      code: "UPI-E1001",
      message: "Unauthorized Error.",
    };
    helper.errorHandler(res, obj, 401);
  }
};
/**
 * This function is using to get the add User Like
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
chatObj.addUserConverstation = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);

  if (userId && req.body.otherUserId) {
    let data = await chatModel.addUserConversation(
      userId,
      req.body.otherUserId
    );

    if (data) {
      helper.successHandler(res, {
        status: true,
        message: "User converstation added succesfully",
        payload: data,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "AK-E1000",
      message: "Failed, Please try again.",
      status: false,
    });
  }
};

/*
 * This is using to get one to one message
 * @param
 * @returns
 * @developer :
 *
 */
chatObj.getMessage = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  let conversationId = req.body.conversationId;
  if (userId) {
    if (conversationId) {
      try {
        let result = await chatModel.getMessage(userId, conversationId);

        if (result) {
          helper.successHandler(res, {
            payload: {
              data: result,
            },
          });
        } else {
          helper.errorHandler(
            res,
            {
              code: "AK-E1001",
              message: "No conversation data found.",
              status: false,
            },
            200
          );
        }
      } catch (error) {
        helper.errorHandler(
          res,
          {
            code: "AK-E1002",
            message: "Internal Server Error.",
            status: false,
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          code: "AK-E1002",
          message: "other user id is missing",
          status: false,
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "AK-E1000",
        message: "Unauthorized Error.",
        status: false,
      },
      200
    );
  }
};

/*
 * This is Function to calculate distance
 * @param
 * @returns
 * @developer :Anoop
 *
 */
chatObj.getconversationhistory = async function (req, res) {
  let userId = helper.getUUIDByToken(req);

  if (userId) {
    let userDistance = req.body.userDistance;

    let result = await chatModel.getconversationhistory(userId, userDistance);

    if (result) {
      helper.successHandler(res, {
        payload: result,
      });
    } else {
      helper.errorHandler(
        res,
        {
          code: "AK-E1001",
          status: false,
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "AK-E1000",
        message: "Unauthorized Error.",
        status: false,
      },
      200
    );
  }
};

/**
 * for get all user chat list
 * @param   :
 * @developer   : Manjeet Thakur
 */

chatObj.getAllUserChatList = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let result = await chatModel.getAllUserChatList(userId);
      if (result) {
        return helper.successHandler(res, {
          message: "all chat user list fetched succesfully",
          status: true,
          payload: result,
        });
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "error in getting chat list",
            status: false,
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "als-E1002",
          message: "user not authenticated",
          status: false,
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    return helper.errorHandler(
      res,
      {
        code: "asl-E1002",
        message: "Something went wrong",
        status: false,
      },
      200
    );
  }
};

/**
 * for update seen status
 * @param     :
 * @developer  : Manjeet Thkaur
 */
chatObj.updateSeenStatus = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    let conversationId = req.body.conversationId;
    if (userId) {
      if (conversationId) {
        let result = await chatModel.updateSeenStatus(userId, conversationId);
        if (result) {
          return helper.successHandler(res, {
            status: true,
            message: "seen status updated successfully",
            payload: result,
          });
        } else {
          return helper.errorHandler(
            res,
            {
              code: "asl-E1002",
              message: "error in updating seen status",
              status: false,
            },
            200
          );
        }
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Converstation id is missing",
            status: false,
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "User not authenticated",
          status: false,
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    return helper.errorHandler(
      res,
      {
        code: "asl-E1002",
        message: "something went wrong",
        status: false,
      },
      200
    );
  }
};

/**
 * for get unread chat list
 * @param   :
 * @developer   : Manjeet Thakur
 */

chatObj.getUnreadChatList = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let result = await chatModel.getUnreadChatList(userId);
      if (result) {
        return helper.successHandler(res, {
          message: "Unread chat list fetched succesfully",
          status: true,
          payload: result,
        });
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "error in getting unread chat list",
            status: false,
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "als-E1002",
          message: "user not authenticated",
          status: false,
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    return helper.errorHandler(
      res,
      {
        code: "asl-E1002",
        message: "Something went wrong",
        status: false,
      },
      200
    );
  }
};

module.exports = chatObj;
