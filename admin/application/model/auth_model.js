/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : anoop kumar <anoop.zeroit@gmail.com>, june 2024
 * Description :
 * Modified By :
 */
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper"),
  randomstring = require("randomstring"),
  commonModel = require("./common_model");
nodeMailer = require("nodemailer");

let authModel = {};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.sendActivationEmail = async function (body, activationCode) {
  let to = body.email,
    from = "Kawacha-mania <anoop.zeroit@gmail.com>";

  if (body.name) {
    username = body.name;
  }

  let sub = "Activation Account";

  let emailArray = {
    to: to,
    from: from,
    subject: sub,
    body: "Your activation code is " + activationCode,
  };

  if (commonModel.generalMail(emailArray)) {
    return true;
  }
  return false;
};
/**
 * Forgot password model
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.forgotPassword = async function (email) {
  let deferred = q.defer(),
    selectObj = {
      au_email: email,
    },
    results = await mongoHelper.getData(selectObj, "admin_users");
  if (results && results.length > 0) {
    if (results[0].au_active == "1") {
      let randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000),
        updateObj = {
          au_activation_token: randomNumber,
        },
        result = await mongoHelper.updateData(
          selectObj,
          "admin_users",
          updateObj
        );
      if (result) {
        let emailArray = {
          to: email,
          from: "Kawacha-mania <rohit.zeroit@gmail.com>",
          subject: "Forgot password ",
          body: "Your forgot password token is " + randomNumber + ".",
        };

        commonModel.generalMail(emailArray);

        deferred.resolve({
          message: "Forgot password token sent to your email",
        });
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve({
        code: "CCS-E1002",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};

/**
 * Reset password model
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.resetPassword = async function (body) {
  let deferred = q.defer(),
    selectObj = {
      au_email: body.email,
    },
    results = await mongoHelper.getData(selectObj, "admin_users");

  if (results && results.length > 0) {
    if (results[0].au_activation_token == body.code) {
      let hashedPassword = passwordHash.generate(body.password);

      let updateObj = {
          au_activation_token: "",
          au_password: hashedPassword,
        },
        result = await mongoHelper.updateData(
          selectObj,
          "admin_users",
          updateObj
        );

      if (result) {
        deferred.resolve(true);
      } else {
        deferred.resolve({
          code: "CCS-E1110",
        });
      }
    } else {
      deferred.resolve({
        code: "CCS-E1010",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};

/**
 * Activate account model
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.activateAccount = async function (body) {
  let deferred = q.defer();
  let selectObj = {
    au_email: body.email,
  };
  let sendCode = {
    code: "ZT-E1010",
  };
  let results = await mongoHelper.getData(selectObj, "admin_users");

  if (results && results.length > 0) {
    if (results[0].uc_active == "1") {
      let obj = {
        code: "ZT-E1011",
      };

      deferred.resolve(obj);
      return deferred.promise;
    }

    if (results[0].uc_activation_token == body.token) {
      let updateObj = {
        au_active: "1",
      };

      let updateData = await mongoHelper.updateData(
        selectObj,
        "admin_users",
        updateObj
      );

      if (updateData) {
        deferred.resolve(true);
      } else {
        deferred.resolve(sendCode);
      }
    } else {
      deferred.resolve(sendCode);
    }
  } else {
    deferred.resolve(sendCode);
  }

  return deferred.promise;
};

/**
 * Resend Activation Code model
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.resendActivationCode = async function (email) {
  let deferred = q.defer();
  let selectObj = {
    au_email: email,
  };
  let results = await mongoHelper.getData(selectObj, "admin_users");

  if (results && results.length > 0) {
    if (results[0].au_active == "0") {
      let randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let updateObj = {
          au_activation_token: randomNumber,
        },
        result = await mongoHelper.updateData(
          selectObj,
          "admin_users",
          updateObj
        );

      if (result) {
        let emailArray = {
          to: email,
          from: "Kawacha-mania <dikshaj.zeroit@gmail.com>",
          subject: "Resending Account Activation ",
          body: " Your activation code is " + randomNumber + ".",
        };

        commonModel.generalMail(emailArray);

        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve({
        code: "CCS-E1014",
      });
    }
  } else {
    deferred.resolve({
      code: "CCS-E1013",
    });
  }

  return deferred.promise;
};

/**
 * Activate user account when user click email link.
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.verifyUserAccount = async (userUUId = "") => {
  let deferred = q.defer();

  if (userUUId) {
    let selectQuery = `SELECT u_id, u_name, u_image, u_email, u_active_count, u_activation_token, u_active FROM user WHERE u_uuid = ?`,
      results = await commonModel.commonSqlQuery(selectQuery, [userUUId]);

    if (results && results.sqlMessage) {
      deferred.resolve({});
    } else {
      let updateQuery = `UPDATE user SET u_active = ?, u_active_count = ? WHERE u_uuid = ?`,
        dataArray = ["1", "0", userUUId];

      pool.query(updateQuery, dataArray, async (error, resultsOne) => {
        if (error) {
          deferred.resolve({});
        } else {
          commonModel.verifyPrimaryEmail(results[0].u_email, results[0].u_id);

          let date = await helper.getPstDateTime("timeDate"),
            joinDate = await helper.dateFormat(date, "n"),
            activityObj = {
              userId: results[0].u_id,
              actionUserId: results[0].u_id,
              description:
                results[0].u_name + " activated account on dated " + joinDate,
              activityType: "SIGNUP",
              date: date,
            },
            userData = {
              userId: results[0].u_id,
              userEmail: results[0].u_email,
              userName: results[0].u_name,
              userImage: results[0].u_image,
            };
          helper.insertUserActivityLogs(activityObj);

          authModel.sendWelcomeEmail(results[0].u_id);
          deferred.resolve(userData);
        }
      });
    }
  } else {
    deferred.resolve({});
  }

  return deferred.promise;
};

/**
 * This function is using for get keys list
 * @param     :
 * @returns   :
 * @developer :Bhagavath Choudhary
 */

authModel.adminChangePassword = async function (body, userId) {
  let deferred = q.defer();
  let checkingUuid = {
    au_uuid: userId.userId,
  };
  let result = await mongoHelper.getData(checkingUuid, "admin_users");

  let verifyPassword = passwordHash.verify(
    body.currentPassword,
    result[0].au_password
  );
  if (verifyPassword) {
    let hashedPassword = passwordHash.generate(body.password);
    let passwordObj = {
      au_password: hashedPassword,
    };
    let resultOne = await mongoHelper.updateData(
      checkingUuid,
      "admin_users",
      passwordObj
    );
    let resultO = await mongoHelper.getData(checkingUuid, "admin_users");
    if (resultOne) {
      deferred.resolve(resultOne);
    } else {
      deferred.resolve(false);
    }
    deferred.resolve(false);
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * This function is using for get keys list
 * @param     :
 * @returns   :
 * @developer :Mohit
 */

authModel.adminEditProfile = async function (body, userId) {
  let deferred = q.defer();
  let checkingUuid = {
    au_uuid: userId.userId,
  };
  let result = await mongoHelper.getData(checkingUuid, "admin_users");

  if (result) {
    let updateObj = {
      au_firstname: body.username,
      au_email: body.email,
    };

    let resultOne = await mongoHelper.updateData(
      checkingUuid,
      "admin_users",
      updateObj
    );
    let resultO = await mongoHelper.getData(checkingUuid, "admin_users");
    if (resultOne) {
      deferred.resolve(resultO);
    } else {
      deferred.resolve(false);
    }
    deferred.resolve(false);
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};
/**
 * editUploadImage
 * @param     :
 * @returns   :
 * @developer : Manjeet
 */
authModel.editUploadImage = async function (userId, fileName) {
  let deferred = q.defer();
  if (userId && fileName) {
    let selectObj = {
      au_uuid: userId,
    };

    let updateObj = {
      au_profileImage: fileName,
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "admin_users",
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
 * This is using for get member list
 * @param    :
 * @developer   : Anoop Kumar
 */

authModel.getMemberList = async function (body) {
  let deferred = q.defer();
  let MemberObj = {
    au_deleted: "0",
  };
  let memberArray = await mongoHelper.getmemberListData(
    MemberObj,
    "admin_users",
    body
  );
  if (memberArray && memberArray.data && memberArray.data.length > 0) {
    for (const result of memberArray.data) {
      result.au_created = helper.dateFormat(result.au_created, "date");
    }

    deferred.resolve(memberArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};
/**
 * for send inbox message
 * @param    :
 * @developer   : Manjeet Thakur
 */
authModel.sendInbox = async function (body) {
  console.log("body", body);
  let deferred = q.defer();

  try {
    if (body) {
      let mobile;
      let getMobile = await mongoHelper.getData(
        { au_uuid: body.userId },
        "admin_users"
      );
      if (getMobile) {
        mobile = getMobile[0].au_countryCode + getMobile[0].au_mobile;
        console.log("mobile", mobile);
      }
      let conObj = await constants.getConstant();
      const accountSid = conObj.TWILIO_SID;
      const authToken = conObj.TWILIO_TOKEN;
      const client = require("twilio")(accountSid, authToken);

      client.messages
        .create({
          body: body.message,
          from: conObj.TWILIO_PHONE_NUMBER,
          to: mobile,
        })
        .then((message) => {
          deferred.resolve(true);
        })
        .catch((error) => {
          console.log(
            error,
            "errorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerror"
          );

          if (error && error.code && error.code !== "") {
            deferred.resolve(error.code);
          } else {
            deferred.resolve(false);
          }
        });
    }
  } catch (err) {
    console.log(err, "Caught exception");
    deferred.resolve(false);
  } finally {
    deferred.resolve(false);
  }

  return deferred.promise;
};
/**
 * Check user exist model
 * @param     :
 * @returns   :
 * @developer :
 */
authModel.checkEmailExist = async function (email) {
  let deferred = q.defer();

  if (email) {
    let emailObj = {
      uc_email: email,
    };

    let userData = await mongoHelper.getData(emailObj, "users_credential");

    if (userData) {
      deferred.resolve(userData);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};
module.exports = authModel;
