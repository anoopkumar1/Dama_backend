/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  : Anoop kumar <anoop.zeroit@gmail.com>, June 2024
 * Description :
 * Modified By :
 */
const path = require("path");
const busboy = require("busboy");
const helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper"),
  passwordHash = require("password-hash"),
  authModel = require("../model/auth_model");
constants = require("../../../common/config/constants");

let authObj = {};

/**
 *
 * This function is using to register user
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
authObj.registerWithEmail = async function (req, res) {
  if (
    req &&
    req.body.email &&
    req.body.password &&
    req.body.phone &&
    req.body.countryCode
  ) {
    if (req.body.countryCode.length > 5) {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "RE-10004",
          message:
            "Please enter a valid Code, max length of Country-code is 5 characters.",
        },
        200
      );
      return;
    }

    if (req.body.phone.length > 15) {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "RE-10005",
          message:
            "Please enter a valid number, max length of Phone-Number is 15 characters.",
        },
        200
      );
      return;
    }

    let userEmailData = await authModel.checkEmailExist(req.body.email);

    if (userEmailData && userEmailData.length > 0) {
      let selectObj = {
        uc_email: req.body.email,
      };

      let resultArray = await mongoHelper.getData(
        selectObj,
        "users_credential"
      );

      if (resultArray && resultArray.length > 0) {
        let statusCode = "",
          message = "";

        if (resultArray[0].uc_active == "1") {
          let sendOtp = await authModel.sendEmailCode(
            req.body.email,
            resultArray[0].uc_uuid
          );

          if (sendOtp == true) {
            helper.successHandler(res, {});
            return;
          } else {
            helper.successHandler(res, {
              status: false,
              message: "Failed, Please try again.",
              code: "RE-100011",
            });
            return;
          }
        } else if (resultArray[0].uc_deleted == "1") {
          message =
            "User prohibited, please contact Community support team for help.";
        } else if (resultArray[0].uc_active == "0") {
          statusCode = "ZT-E1001";
          message = "User already exists. Please signup with other account.";
        }

        let obj = {
          code: statusCode,
          message: message,
          status: false,
        };

        helper.successHandler(res, obj);
      }
    } else {
      let results = await authModel.registerWithEmail(req.body);
      if (results) {
        helper.successHandler(res, {});
      } else {
        helper.errorHandler(
          res,
          {
            status: false,
            code: "RE-10002",
          },
          200
        );
      }
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "ASL-E1002",
        message: "Please fill mandatory fields.",
        status: false,
      },
      200
    );
  }
};

/**
 * This function is using to verify user account by entring activation code
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 */
authObj.verifyEmail = async function (req, res) {
  if (req.body.email && req.body.otp) {
    let row = await authModel.verifyEmail(req.body);

    if (row && row.code) {
      let obj = {};
      obj.message = "Wrong activation code";
      obj.status = false;
      helper.errorHandler(res, obj, 200);
    } else {
      helper.successHandler(res, {});
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "CCS-E2001",
        message: "All fields are required.",
        status: false,
      },
      200
    );
  }
};

/**
 * This function is using to user Fogot password
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
authObj.userForgotPasswordEmail = async function (req, res) {
  let obj = {};

  if (req.body && req.body.email) {
    let row = await authModel.forgotPasswordEmail(req.body.email);

    if (row && row.code) {
      obj.code = row.code;

      if (row.code == "CCS-E1010") {
        obj.message = "Wrong activation code";
        obj.status = false;
      } else if (row.code == "CCS-E1013") {
        obj.message = "Account does not exist";
        obj.status = false;
      } else if (row.code == "CCS-E1002") {
        obj.message = "Account exist but not verified";
        obj.status = false;
      }
      helper.errorHandler(res, obj, 200);
    } else {
      helper.successHandler(res, {});
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "CCS-E2001",
        message: "All fields are required.",
        status: false,
      },
      200
    );
  }
};

/**
 * This function is using to user reset password
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authObj.resetPasswordEmail = async function (req, res) {
  if (req && req.body && req.body.email && req.body.password) {
    let row = await authModel.resetPasswordEmail(req.body);

    if (row) {
      helper.successHandler(res, {}, 200);
    } else {
      helper.errorHandler(
        res,
        {
          code: "CCS-E2001",
          message: "Something went wrong.",
          status: false,
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "CCS-E2001",
        message: "All fields are required.",
        status: false,
      },
      200
    );
  }
};

/**
 *This function is using activate user account
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */

authObj.activateAccount = async function (req, res) {
  if (req.body.email && req.body.otp) {
    let row = await authModel.activateAccount(req.body);

    if (row && row.code) {
      let obj = {};
      obj.code = row.code;

      if (row.code == "ZT-E1011") {
        obj.message = "Operation performed successfully";
        obj.status = true;
      } else {
        obj.message = "Wrong activation code";
        obj.status = false;
      }

      helper.errorHandler(res, obj, 200);
    } else {
      let selectObj = {
        uc_email: req.body.email,
      };
      let results = await mongoHelper.getData(selectObj, "users_credential");

      if (results && results.length > 0) {
        helper.successHandler(res, {
          payload: {
            uuid: results[0].uc_uuid,
          },
        });
      } else {
        helper.successHandler(res, {
          code: "ASL-E1010",
          message: "Failed, Please try again.",
          status: false,
        });
      }
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "CCS-E2001",
        message: "All fields are required.",
        status: false,
      },
      200
    );
  }
};

/**
 *
 * This function is using to risend activation code
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 *
 */
authObj.resendEmailCode = async function (req, res) {
  if (req && req.body.email) {
    let userEmailData = await authModel.checkEmailExist(req.body.email);

    if (userEmailData && userEmailData.length > 0) {
      let sendOtp = await authModel.sendEmailCode(
        req.body.email,
        userEmailData[0].uc_uuid
      );

      if (sendOtp == true) {
        helper.successHandler(res, {});
        return;
      } else {
        helper.successHandler(res, {
          status: false,
          message: "Failed, Please try again.",
          code: "RE-100011",
        });
        return;
      }
    } else {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "RE-10002",
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      },
      200
    );
  }
};

/**
 * This function is using to login user
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authObj.loginWithEmail = async function (req, res) {
  if (
    req &&
    req.body &&
    req.body.email &&
    req.body.password &&
    // req.body.deviceToken &&
    // req.body.deviceId &&
    req.body.devicePlatform
  ) {
    let emailObj = {
      uc_email: req.body.email,
    };

    let userData = await mongoHelper.getData(emailObj, "users_credential");

    if (userData && userData.length > 0) {
      let verifyPassword = passwordHash.verify(
        req.body.password,
        userData[0].uc_password
      );

      if (userData[0].uc_active && userData[0].uc_active == "0") {
        let obj = {
          code: "CCS-E1000",
          message: "User doesn`t exist.",
          status: false,
        };
        helper.errorHandler(res, obj, 200);
      } else if (userData[0].uc_deleted && userData[0].uc_deleted == "1") {
        let obj = {
          code: "CCS-E1001",
          message: "User prohibited, please contact support team for help.",
          status: false,
        };
        helper.errorHandler(res, obj, 200);
      } else if (!verifyPassword) {
        let obj = {
          code: "CCS-E1002",
          message: "Incorrect email or password.",
          status: false,
        };

        helper.errorHandler(res, obj, 200);
      } else {
        if (userData[0].uc_active == "1") {
          let result = await authModel.loginWithEmail(req.body);

          if (result) {
            let payload = {
                iat: Date.now(),
                userId: result.uc_uuid,
              },
              token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
            result.token = token;
            let commonData = {
              token: result.token,
              userType: result.uc_user_type,
              onlineStatus: result.uc_online_status,
            };

            let obj = {
              message: "Login successfully.",
              payload: commonData,
            };

            helper.successHandler(res, obj);
          } else {
            let obj = {
              code: "CCS-E10003",
              status: false,
            };
            helper.errorHandler(res, obj, 200);
          }
        } else {
          let obj = {
            code: "CCS-E1004",
            message: "Login credentials are incorrect.",
            status: false,
          };
          helper.errorHandler(res, obj, 200);
        }
      }
    } else {
      let obj = {
        code: "CCS-E1005",
        message: "Account does not exist.",
        status: false,
      };
      helper.errorHandler(res, obj, 200);
    }
  } else {
    let obj = {
      code: "CCS-E1006",
      message: "All fields are required",
      status: false,
    };
    helper.errorHandler(res, obj, 200);
  }
};

/**
 * This function is using to logout user
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authObj.logout = async function (req, res) {
  let userId = await helper.getUUIDByToken(req);
  let obj = {
    payload: "Device not deleted",
  };
  if (userId) {
    deleteDevice = await authModel.removeUserDevice(userId);

    if (deleteDevice) {
      helper.successHandler(res, {
        payload: "Device logout successfully",
      });
    } else {
      helper.errorHandler(res, obj);
    }
  } else {
    helper.errorHandler(res, obj);
  }
};

/**
 * Used to logout.
 * Created By 	:
 * Modified By 	:
 */
authObj.deleteAccount = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  if (userId) {
    deleteDevice = await authModel.deleteAccount(userId);

    if (deleteDevice) {
      helper.successHandler(res, {
        payload: deleteDevice,
      });
    } else {
      helper.errorHandler(
        res,
        {
          status: false,
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        status: false,
      },
      200
    );
  }
};

/**
 * for profile visibility
 * @param      :
 * @developer   : Manjeet Thakur
 */

authObj.profileVisibility = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let updateProfileVisibility = await authModel.updateProfileVisibility(
        userId
      );
      if (updateProfileVisibility) {
        helper.successHandler(res, {
          message: "Profile visibility updated succesfully",

          status: true,
          payload: {},
        });
      } else {
        helper.errorHandler(res, {
          message: "failed to update profile visibitlity",
          code: "asl-E1002",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        message: "user not authenicated ",
        code: "asl-E1-002",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(res, {
      message: "something went wrong ",
      code: "asl-E1-002",
      status: false,
      payload: [],
    });
  }
};

/**
 * for add personal and professional details
 * @param   :
 * @developer   : Anoop kumar
 */

authObj.addPersonalDetails = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (
      req.body &&
      req.body.firstName &&
      req.body.middleName &&
      req.body.lastName &&
      req.body.country &&
      req.body.nationality &&
      req.body.title &&
      req.body.institution &&
      req.body.bio
    ) {
      let updateData = await authModel.addPersonalDetails(req.body, userId);
      if (updateData) {
        helper.successHandler(res, {
          message: "Operation performed successfully.",
          status: true,
          payload: updateData,
        });
      } else {
        helper.errorHandler(res, {
          message: "Failed to insert data. Please try again.",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill mandatory fields",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.error("Error in addPersonalandProfessionalDetails:", error);
    helper.errorHandler(res, {
      message: "Something went wrong.",
      status: false,
      payload: [],
    });
  }
};

authObj.editUploadProfileImage = async function (req, res) {
  try {
    const fields = {};
    const chunks = [];
    let fName, fType, fEncoding;

    let conObj = await constants.getConstant();
    let Busboy = busboy({ headers: req.headers });

    Busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    Busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      let ext = path.extname(filename).toLowerCase();
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        let obj = {
          status: false,
          code: "ASL-E1004",
          message: "Invalid file extension!",
          payload: [],
        };
        chunks.push(obj);
        file.resume();
      } else {
        let newName = Date.now() + ext;
        fName = newName.replace(/ /g, "_");
        fType = mimetype;
        fEncoding = encoding;
        file.on("data", (data) => {
          chunks.push(data);
        });
      }
    });

    Busboy.on("finish", async () => {
      if (!fields.email) {
        return helper.errorHandler(res, {
          status: false,
          code: "ASL-E1003",
          message: "Email is required.",
          payload: [],
        });
      }

      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.UPLOAD_PROOF_PATH + conObj.PROFILE_IMAGE_PATH,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        returnObj.filename = fName;
        let image = await authModel.editUploadProfileImage(fields.email, fName);
        if (image) {
          obj.payload = returnObj.Location || "";
          helper.successHandler(res, obj);
        } else {
          helper.errorHandler(res, {
            status: false,
            message: "Failed to update profile image.",
            payload: [],
          });
        }
      } else {
        helper.errorHandler(res, {
          status: false,
          message: "Failed to upload file.",
          payload: [],
        });
      }
    });

    return req.pipe(Busboy);
  } catch (error) {
    console.error("Error in editUploadProfileImage:", error);
    helper.errorHandler(res, {
      status: false,
      message: "Something went wrong.",
      payload: [],
    });
  }
};

/**
 * for upload cover image
 * @param   :
 * @developer   : Manjeet Thakur
 */
authObj.editUploadCoverImage = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fName,
      fType,
      fEncoding,
      Busboy = busboy({ headers: req.headers });
    Busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });
    Busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      let ext = path.extname(filename).toLowerCase();
      // console.log(ext, "----------------------00000");
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        let obj = {
          status: true,
          code: "",
          message: "invalid extension!",
          payload: [],
        };
        chunks.push(obj);
        file.resume();
      } else {
        let newName = Date.now() + ext;

        fName = newName.replace(/ /g, "_");
        fType = mimetype;
        fEncoding = encoding;

        file.on("data", function (data) {
          chunks.push(data);
        });
      }
    });

    Busboy.on("finish", async function () {
      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.UPLOAD_PROOF_PATH + conObj.PROFILE_IMAGE_PATH,
      };

      let returnObj = await helper.uploadFile(fileObj);

      let obj = {};

      if (returnObj) {
        returnObj.filename = fName;
        let image = await authModel.editUploadCoverImage(userId, fName);
        // console.log(image, "pppppppppppppppppp");
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
    return req.pipe(Busboy);
  } else {
    helper.errorHandler(
      res,
      {
        status: false,
        message: "You are not authorized !!",
      },
      401
    );
    helper.errorHandler(res, obj, 401);
  }
};

/**
 * for update first name , middlename , lastname
 * @param   :
 * @developer  : Manjeet Thakur
 */

authObj.editUserInformation = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      if (
        req.body.firstName &&
        req.body.middleName &&
        req.body.lastName &&
        req.body.title &&
        req.body.institution
      ) {
        let editInformation = await authModel.editInformation(userId, req.body);
        if (editInformation) {
          helper.successHandler(res, {
            message: "information edited succesfully",

            status: true,
            payload: {},
          });
        } else {
          helper.errorHandler(res, {
            messge: "error in updating information",
            code: "asl-E1002",
            status: false,
            payload: [],
          });
        }
      } else {
        helper.errorHandler(res, {
          messge: "all fields are required",
          code: "asl-E1002",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        message: "user not authenticated",
        code: "asl-E1002",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(res, {
      message: "something went wrong",
      code: "asl-E1002",
      status: false,
      payload: [],
    });
  }
};

/**
 * for update bio
 * @param   :
 * @developer  : Manjeet Thakur
 */
authObj.editBio = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      if (req.body.bio) {
        let updateBio = await authModel.editBio(userId, req.body);
        if (updateBio) {
          helper.successHandler(res, {
            message: "bio updated successfully",

            status: true,
            payload: {},
          });
        } else {
          helper.errorHandler(res, {
            message: "error in updation",
            code: "asl-E1002",
            status: false,
            payload: [],
          });
        }
      } else {
        helper.errorHandler(res, {
          message: "all fields are mandatory",
          code: "asl-E1002",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        message: "user not authenticated",
        code: "asl-E1002",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(res, {
      message: "something went wrong",
      code: "asl-E1002",
      status: false,
      payload: [],
    });
  }
};

/**
 * Activate user account by entring activation code
 * @param     :
 * @returns   :
 */

authObj.userChangePassword = async function (req, res) {
  let userId = helper.getUUIDByToken(req);

  if (!req.body || !req.body.newPassword || !req.body.confirmPassword) {
    return helper.errorHandler(
      res,
      {
        message: "Failed. Missing parameters.",
        status: false,
      },
      400
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return helper.errorHandler(
      res,
      {
        message: "New password and confirm password do not match.",
        status: false,
      },
      400
    );
  }

  try {
    let results = await authModel.userChangePassword(req.body, userId);
    // console.log(results, "=================================");

    if (results) {
      return helper.successHandler(
        res,
        {
          message: "Password successfully changed.",
        },
        200
      );
    } else {
      return helper.errorHandler(
        res,
        {
          message: "Failed, Please try again.",
          status: false,
        },
        500
      );
    }
  } catch (error) {
    console.error(error);
    return helper.errorHandler(
      res,
      {
        message: "An error occurred. Please try again later.",
        status: false,
      },
      500
    );
  }
};

/**
 * for save login data of linkedin
 */
// authObj.registerWithEmail = async function (req, res) {
//   let phone = req.body.phone;
//   let pwd = String(req.body.password);
//   let hashedPassword = passwordHash.generate(pwd);

//   if (
//     req &&
//     req.body.name &&
//     req.body.phone &&
//     req.body.email &&
//     hashedPassword &&
//     req.body.dob &&
//     req.body.sex &&
//     req.body.nationality &&
//     req.body.sexual_orientation &&
//     req.body.type &&
//     req.body.countryCode
//   ) {
//     let results = await authModel.insertUserAllData(req.body);

//     if (results) {
//       let emailObj = {
//         uc_email: phone,
//       };
//       let resultArray = await mongoHelper.getData(emailObj, "users_credential");
//       let payload = {
//           iat: Date.now(),
//           userId: resultArray[0].uc_uuid,
//         },
//         token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
//       let commonData = {
//         uc_token: token,
//         uc_name: resultArray[0].uc_name,
//         uc_email: resultArray[0].uc_email,
//         uc_type: resultArray[0].uc_type,
//       };
//       let obj = {
//         payload: commonData,
//       };
//       helper.successHandler(res, obj);
//     } else {
//       helper.errorHandler(
//         res,
//         {
//           status: false,
//           code: "RE-10002",
//         },
//         200
//       );
//     }
//     // }
//   } else {
//     helper.errorHandler(res, {
//       code: "ASL-E1002",
//       message: "Please fill manadatory fields.",
//       status: false,
//     });
//   }
// };

/**
 *  for save login data of linkedin
 * @param     :
 * @developer  : Manjeet Thakur
 */

authObj.getUserLinkedinData = async function (req, res) {
  let email = req.body.email;
  if (email) {
    let email = req.body.email;

    let validEmail = await helper.isEmailValid(req.body.email);

    if (!validEmail) {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "CCS-E2011",
          message: "Please enter valid email.",
          payload: {},
        },
        200
      );
      return;
    }

    let userEmailData = "";
    userEmailData = await authModel.checkEmailExist(req.body.email);
    if (userEmailData && userEmailData.length > 0) {
      let updateObj = {
        uc_email: email,
      };

      let selectObj = {
        uc_uuid: userEmailData[0].uc_uuid,
      };

      let results = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );
      let resultArray = await mongoHelper.getData(
        updateObj,
        "users_credential"
      );

      let payload = {
          iat: Date.now(),
          userId: resultArray[0].uc_uuid,
        },
        token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
      let commonData = {
        uc_token: token,
        uc_name: resultArray[0].uc_firstname,
        uc_last_name: resultArray[0].uc_lastname,
        uc_email: resultArray[0].uc_email,
        uc_countryCode: resultArray[0].uc_country_code,
        uc_phone: resultArray[0].uc_phone,
        uc_country: resultArray[0].uc_country,
        uc_source_type: resultArray[0].uc_source_type,
      };

      helper.successHandler(res, {
        status: true,
        message: "Data get succesfully",
        payload: commonData,
        code: "0",
      });
    } else {
      let results = await authModel.insertUserLinkedinData(req.body);

      if (results) {
        let emailObj = {
          uc_email: email,
        };
        let resultArray = await mongoHelper.getData(
          emailObj,
          "users_credential"
        );

        let payload = {
            iat: Date.now(),
            userId: resultArray[0].uc_uuid,
          },
          token = jwt.sign(payload, "@&*(29783-d4343daf4dd*&@&^#^&@#");
        let commonData = {
          uc_token: token,
          uc_name: resultArray[0].uc_firstname,
          uc_lastname: resultArray[0].uc_lastname,
          uc_email: resultArray[0].uc_email,
          uc_countryCode: resultArray[0].uc_country_code,
          uc_phone: resultArray[0].uc_phone,
          uc_country: resultArray[0].uc_country,
          uc_source_type: resultArray[0].uc_source_type,
        };

        helper.successHandler(
          res,
          {
            status: true,
            message: "Data inserted succesfully",
            code: "1",
            payload: commonData,
          },
          200
        );
      } else {
        helper.errorHandler(
          res,
          {
            status: false,
            code: "RE-10002",
          },
          200
        );
      }
    }
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};

/**
 * for upload profile image with token
 * @param   :
 * @developer   : Manjeet Thakur
 */
authObj.editUploadProfileImageWithToken = async function (req, res) {
  try {
    let userId = helper.getUUIDByToken(req);
    if (!userId) {
      return helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "user is not authenicated",
        status: false,
      });
    }
    const fields = {};
    const chunks = [];
    let fName, fType, fEncoding;

    let conObj = await constants.getConstant();
    let Busboy = busboy({ headers: req.headers });

    Busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    Busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      let ext = path.extname(filename).toLowerCase();
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        let obj = {
          status: false,
          code: "ASL-E1004",
          message: "Invalid file extension!",
          payload: [],
        };
        chunks.push(obj);
        file.resume();
      } else {
        let newName = Date.now() + ext;
        fName = newName.replace(/ /g, "_");
        fType = mimetype;
        fEncoding = encoding;
        file.on("data", (data) => {
          chunks.push(data);
        });
      }
    });

    Busboy.on("finish", async () => {
      if (!userId) {
        return helper.errorHandler(res, {
          status: false,
          code: "ASL-E1003",
          message: "UserId is required.",
          payload: [],
        });
      }

      let fileObj = {
        fileName: fName,
        chunks: chunks,
        encoding: fEncoding,
        contentType: fType,
        uploadFolder: conObj.UPLOAD_PROOF_PATH + conObj.PROFILE_IMAGE_PATH,
      };

      let returnObj = await helper.uploadFile(fileObj);
      let obj = {};

      if (returnObj) {
        returnObj.filename = fName;
        let image = await authModel.editUploadProfileImageWithToken(
          userId,
          fName
        );
        if (image) {
          obj.payload = returnObj.Location || "";
          helper.successHandler(res, obj);
        } else {
          helper.errorHandler(res, {
            status: false,
            message: "Failed to update profile image.",
            payload: [],
          });
        }
      } else {
        helper.errorHandler(res, {
          status: false,
          message: "Failed to upload file.",
          payload: [],
        });
      }
    });

    return req.pipe(Busboy);
  } catch (error) {
    console.error("Error in editUploadProfileImage:", error);
    helper.errorHandler(res, {
      status: false,
      message: "Something went wrong.",
      payload: [],
    });
  }
};

module.exports = authObj;
