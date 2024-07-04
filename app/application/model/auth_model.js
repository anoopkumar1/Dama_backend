/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  : Anoop kumar <mailto:anoop.zeroit@gmail.com>, June 2024
 * Description :
 * Modified By :
 */
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");
nodeMailer = require("nodemailer");
const authModel = {};

/**
 *
 * This function is using to register user
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
authModel.registerWithEmail = async function (body) {
  let deferred = q.defer();

  if (body) {
    let uuid = v4(Date.now()),
      insertTable = "users_credential",
      date = await helper.getUtcTime();

    let hashedPassword = passwordHash.generate(body.password);
    let token = Math.floor(Math.random() * (9999 - 1000) + 1000);
    let insertObj = {
      uc_uuid: uuid,
      uc_phone: body.phone,
      uc_country_code: body.countryCode,
      uc_password: hashedPassword,
      uc_email: body.email,
      uc_registeration_type: "APP",
      uc_activation_token: token,
      uc_profile_visibility: "0",
      uc_notificationSetting: "0",
      uc_privacyPolicy: "0",
      uc_security: "0",
      uc_profie_image: "",
      uc_cover_image: "",
      uc_active: "0",
      uc_deleted: "0",
      uc_contact_details: "0",
      uc_online_status: "1",
      uc_created: date,
      uc_updated: date,
    };

    let results = await mongoHelper.insert(insertObj, insertTable);

    if (results) {
      let sendOtp = await authModel.sendRegisterEmail(body.email, token);

      if (sendOtp == true) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * This function is using to login user
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.loginWithEmail = async function (body) {
  let deferred = q.defer();

  // // console.log("Starting loginWithEmail function...");

  if (body && body.email) {
    let emailObj = {
      uc_email: body.email,
    };

    // console.log("Fetching user data for email:", body.email);
    let userData = await mongoHelper.getData(emailObj, "users_credential");

    if (userData && userData.length > 0) {
      let loginUserData = userData[0];

      // console.log("User data found:", loginUserData);

      if (
        loginUserData.uc_password &&
        passwordHash.verify(body.password, loginUserData.uc_password)
      ) {
        // console.log("Password verification successful");

        let deviceObj = {
          ud_fk_uc_uuid: loginUserData.uc_uuid,
          ud_device_id: body.deviceId,
          ud_token: body.deviceToken,
          ud_type: "M",
          ud_platform: body.devicePlatform,
        };
        // console.log("Adding device:", deviceObj);
        let loginDevice = await authModel.addDeviceIfNotExists(deviceObj);

        if (loginUserData) {
          // console.log("Device added successfully");
          deferred.resolve(loginUserData);
        } else {
          // console.log("Failed to add device");
          deferred.resolve(false);
        }
      } else {
        // console.log("Password verification failed");
        deferred.resolve(false);
      }
    } else {
      // console.log("User data not found for email:", body.email);
      deferred.resolve(false);
    }
  } else {
    // console.log("Invalid body or email not provided");
    deferred.resolve(false);
  }

  // console.log("Returning deferred promise");
  return deferred.promise;
};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 */

authModel.addDeviceIfNotExists = async function (data) {
  if (
    data &&
    data.ud_device_id &&
    data.ud_fk_uc_uuid &&
    data.ud_token &&
    data.ud_type &&
    data.ud_platform
  ) {
    let removeData = await authModel.removeUserDevice(data.ud_device_id);

    if (removeData) {
      let inserData = await mongoHelper.insert(data, "users_devices");

      if (inserData) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * This function is using to user to set again password
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.resetPasswordEmail = async function (body) {
  let deferred = q.defer();
  let selectObj = {
    uc_email: body.email,
  };
  let results = await mongoHelper.getData(selectObj, "users_credential");

  if (results && results.length > 0) {
    let hashedPassword = passwordHash.generate(body.password);
    let updateObj = {
        uc_password: hashedPassword,
      },
      result = await mongoHelper.updateData(
        selectObj,
        "users_credential",
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
 * This function is using to check user exist or not
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.checkUserExist = async function (uid) {
  let deferred = q.defer();

  if (uid) {
    let emailObj = {
      uc_uuid: uid,
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

/**
 * This function is using to check email exist or not
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
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

/**
 *This function is using activate user account by entring activation code
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.activateAccount = async function (body) {
  let deferred = q.defer();
  let selectObj = {
    uc_email: body.email,
  };
  let sendCode = {
    code: "ZT-E1010",
  };
  let results = await mongoHelper.getData(selectObj, "users_credential");

  if (results && results.length > 0) {
    if (results[0].uc_activation_token == body.otp) {
      let updateObj = {
        uc_active: "1",
        uc_activation_token: "",
      };

      let updateData = await mongoHelper.updateData(
        selectObj,
        "users_credential",
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
 * This function is using to verify user account by entring activation code
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 */
authModel.verifyEmail = async function (body) {
  let deferred = q.defer();
  let selectObj = {
    uc_email: body.email,
  };
  let sendCode = {
    code: "ZT-E1010",
  };
  let results = await mongoHelper.getData(selectObj, "users_credential");

  if (results && results.length > 0) {
    if (results[0].uc_activation_token == body.otp) {
      let updateObj = {
        uc_active: "1",
        uc_activation_token: "",
      };

      let updateData = await mongoHelper.updateData(
        selectObj,
        "users_credential",
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
 *This function is using to sendMail
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */

authModel.generalMail = async function (emailData) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mailto:anoop.zeroit@gmail.com",
      pass: "bwei ygtd gtzm pezx",
    },
  });

  let mailOptions = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.body,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

/**
 *This function is using to generalMail
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.sendRegisterEmail = async function (email, token) {
  let deferred = q.defer();

  let emailArray = {
    to: email,
    from: "Community App <mailto:anoop.zeroit@gmail.com>",
    subject: "verification ",
    body: "Welcome to Dama App.Your otp is " + token + ".",
  };

  authModel.generalMail(emailArray);

  deferred.resolve(true);

  return deferred.promise;
};

/**
 *
 * This function is using to resend activation code
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 *
 */
authModel.sendEmailCode = async function (email, userId) {
  // console.log("sendEmailCode executed");

  let deferred = q.defer();
  let token = Math.floor(Math.random() * (9999 - 1000) + 1000);

  // console.log("Generated token:", token);

  let emailArray = {
    to: email,
    from: "Community App",
    subject: "Verification",
    body: "Welcome to Community App. Your OTP is " + token + ".",
  };
  let sendEmail = await authModel.generalMail(emailArray);
  if (sendEmail) {
    // console.log("Email sent successfully to:", email);

    let selObj = {
      uc_uuid: userId,
    };
    let updateObj = {
      uc_activation_token: token,
    };

    try {
      let res = await mongoHelper.updateData(
        selObj,
        "users_credential",
        updateObj
      );
      if (res) {
        // console.log("Database updated successfully for userId:", userId);
        deferred.resolve(true);
      } else {
        // console.log("Failed to update database for userId:", userId);
        deferred.resolve(false);
      }
    } catch (error) {
      // // console.log(
      //   "Error updating database for userId:",
      //   userId,
      //   "Error:",
      //   error
      // );
      deferred.resolve(false);
    }
  } else {
    // console.log("Failed to send email to:", email);
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is using to user Fogot password
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
authModel.forgotPasswordEmail = async function (email) {
  let deferred = q.defer(),
    selectObj = {
      uc_email: email,
    },
    results = await mongoHelper.getData(selectObj, "users_credential");

  if (results && results.length > 0) {
    if (results[0].uc_active == "1") {
      let randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000),
        updateObj = {
          uc_activation_token: randomNumber,
        },
        result = await mongoHelper.updateData(
          selectObj,
          "users_credential",
          updateObj
        );

      if (result) {
        let emailArray = {
          to: email,
          from: "Community App",
          subject: "verification ",
          body: "Welcome to Community App. Your otp is " + randomNumber + ".",
        };

        authModel.generalMail(emailArray);

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
 * This function is using to logout user
 * @param        :
 * @returns      :
 * @developer    :Anoop Kumar
 */
authModel.removeUserDevice = async function (userId) {
  let deferred = q.defer();

  if (userId) {
    let obj = {
        ud_fk_uc_uuid: userId,
      },
      deleteDevice = await mongoHelper.deleteAllData(obj, "users_devices");
    if (deleteDevice) {
      let objCon = {
        uc_fk_uc_uuid: userId,
      };
      let ob2 = {
        uc_uuid: userId,
      };
      let updateObj = {
        uc_online_status: "0",
      };
      let res = await mongoHelper.updateData(
        ob2,
        "users_credential",
        updateObj
      );
      deleteConnection = await mongoHelper.deleteAllData(
        objCon,
        "users_connections"
      );

      if (deleteConnection) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
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
authModel.deleteAccount = async function (userId) {
  let deferred = q.defer();

  if (userId) {
    let obj = {
        usd_fk_uc_uuid: userId,
      },
      resultOne = await mongoHelper.deleteData(obj, "users_details");
    if (resultOne) {
      let objCon = {
          uc_uuid: userId,
        },
        deleteConnection = await mongoHelper.deleteData(
          objCon,
          "users_credential"
        );

      if (deleteConnection) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};
/**
 * for update profile visibility
 * @param   :
 * @developer   : Manjeet Thakur
 */
authModel.updateProfileVisibility = async (userId) => {
  try {
    let updateObj;
    if (userId) {
      let searrchObj = {
        uc_uuid: userId,
      };
      let getData = await mongoHelper.getData(searrchObj, "users_credential");
      if (getData && getData.length > 0) {
        let profileValue = getData[0].uc_profile_visibility;
        if (profileValue == 1) {
          updateObj = {
            uc_profile_visibility: "0",
          };
        } else {
          updateObj = {
            uc_profile_visibility: "1",
          };
        }
      }
      let updateVisibilty = await mongoHelper.updateData(
        searrchObj,
        "users_credential",
        updateObj
      );
      if (updateVisibilty) {
        return updateVisibilty;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * for add personal and professional details
 * @param   :
 * @developer   : Anoop kumar
 */
authModel.addPersonalDetails = async function (body) {
  try {
    if (
      !body.firstName ||
      !body.middleName ||
      !body.lastName ||
      !body.nationality ||
      !body.country ||
      !body.title ||
      !body.institution ||
      !body.bio
    ) {
      // console.error("Missing mandatory fields");
      return false;
    }
    // console.log("email", body.email);
    let selectObj = {
      uc_email: body.email,
    };

    // console.log("Checking if user exists with:", selectObj);

    let resultOne = await mongoHelper.getData(selectObj, "users_credential");

    if (resultOne && resultOne.length > 0) {
      let updateObj = {
        uc_first_name: body.firstName,
        uc_last_name: body.lastName,
        uc_middle_name: body.middleName,
        uc_nationality: body.nationality,
        uc_country: body.country,
        uc_proffesional_detail: {
          uc_title: body.title,
          uc_institution: body.institution,
          uc_bio: body.bio,
        },
      };

      // console.log("Updating user with:", updateObj);

      let resultTwo = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );

      if (resultTwo) {
        // console.log("User profile updated successfully");
        return true;
      } else {
        // console.error("Failed to update user profile");
        return false; // Failed to update
      }
    } else {
      // console.error("User not found");
      return false; // User not found
    }
  } catch (error) {
    // console.error("Error in addPersonalAndProfessionalDetails:", error);
    return false; // Error occurred
  }
};

/**
 * for add personal and professional details
 * @param   :
 * @developer   : Manjeet Thakur
 */

// authModel.addPersonalAndProffesionalDetails = async (data, userId) => {
//   try {
//     if (data && userId) {
//       let selectObj = {
//         uc_uuid: userId,
//       };
//       let updateObj = {
//         uc_first_name: data.firstName,
//         uc_last_name: data.lastName,
//         uc_middle_name: data.middleName,
//         uc_country: data.country,
//         uc_proffesional_detail: {
//           uc_title: data.title,
//           uc_institution: data.institution,
//           uc_bio: data.bio,
//         },
//       };

//       let setUpProfile = await mongoHelper.updateData(
//         selectObj,
//         "users_credential",
//         updateObj
//       );
//       if (setUpProfile) {
//         return setUpProfile;
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   } catch (error) {
//     // console.log(error);
//     return false;
//   }
// };

/**
 * for upload Profile Image
 * @param    :
 * @developer   : Manjeet Thakur
 */
authModel.editUploadProfileImage = async function (email, fileName) {
  let deferred = q.defer();
  // // console.log(
  //   `editUploadProfileImage called with email: ${email}, fileName: ${fileName}`
  // );

  if (email && fileName) {
    let selectObj = { uc_email: email };
    let updateObj = { uc_profie_image: fileName };

    // console.log("selectObj:", selectObj);
    // console.log("updateObj:", updateObj);

    try {
      let result = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );
      // console.log("Update result:", result);

      if (result) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } catch (error) {
      // console.error("Error updating data:", error);
      deferred.resolve(false);
    }
  } else {
    // console.log("Invalid email or fileName");
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * for upload Profile Image
 * @param    :
 * @developer   : Manjeet Thakur
 */

authModel.editUploadCoverImage = async function (userId, fileName) {
  let deferred = q.defer();
  if (userId && fileName) {
    let selectObj = {
      uc_uuid: userId,
    };

    let updateObj = {
      uc_cover_image: fileName,
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "users_credential",
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
 * for edit user information
 * @param   :
 * @developer  : Manjeet Thakur
 */
authModel.editInformation = async (userId, body) => {
  try {
    if (userId) {
      let searchObj = {
        uc_uuid: userId,
      };
      let bio;
      let data = await mongoHelper.getData(searchObj, "users_credential");
      if (data) {
        // console.log(data, "data");
        bio = data[0].uc_proffesional_detail.uc_bio;
      }
      let updateObj = {
        uc_first_name: body.firstName,
        uc_middle_name: body.middleName,
        uc_last_name: body.lastName,
        uc_proffesional_detail: {
          uc_institution: body.institution,
          uc_title: body.title,
          uc_bio: bio,
        },
      };
      let editInformation = await mongoHelper.updateData(
        searchObj,
        "users_credential",
        updateObj
      );
      if (editInformation) {
        return editInformation;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * for edit Bio
 * @param    :
 * @developer   : Manjeet Thakur
 *
 */
authModel.editBio = async (userId, body) => {
  try {
    let tile, institution;
    if (userId && body) {
      let searchObj = {
        uc_uuid: userId,
      };
      let getdata = await mongoHelper.getData(searchObj, "users_credential");
      if (getdata) {
        tile = getdata[0].uc_proffesional_detail.uc_title;
        institution = getdata[0].uc_proffesional_detail.uc_institution;
      }
      let updateObj = {
        uc_proffesional_detail: {
          uc_bio: body.bio,
          uc_title: tile,
          uc_institution: institution,
        },
      };
      let updateBio = await mongoHelper.updateData(
        searchObj,
        "users_credential",
        updateObj
      );
      if (updateBio) {
        return updateBio;
      } else {
        return false;
      }
    }
  } catch (error) {
    // console.log(error);
    return error;
  }
};

/**
 * This function is using for get keys list
 * @param     :
 * @returns   :
 * @developer :Anoop Jaryal
 */
authModel.userChangePassword = async function (body, userId) {
  let hashedPassword = passwordHash.generate(body.newPassword);
  let checkingUuid = {
    uc_uuid: userId,
  };

  try {
    let result = await mongoHelper.getData(checkingUuid, "users_credential");

    if (!result) {
      throw new Error("User not found");
    }

    let passwordObj = {
      uc_password: hashedPassword,
    };
    let resultOne = await mongoHelper.updateData(
      checkingUuid,
      "users_credential",
      passwordObj
    );

    if (!resultOne) {
      return false;
    }

    let resultTwo = await mongoHelper.getData(checkingUuid, "users_credential");
    return resultTwo;
  } catch (error) {
    // console.error(error);
    return false;
  }
};

/**
 * insert data linkedin
 * @param     :
 * @returns   :
 * @developer :
 */

authModel.insertUserLinkedinData = async function (body) {
  let deferred = q.defer();

  if (body) {
    let date = await helper.getUtcTime();
    let userId = v4(Date.now());
    let insertObj = {
      uc_uuid: userId,
      uc_email: body.email,
      uc_source_type: body.sourceType,
      uc_active: "1",
      uc_deleted: "0",
      uc_created: date,
      uc_updated: date,
    };
    let results = await mongoHelper.insert(insertObj, "users_credential");

    if (results) {
      deferred.resolve(results);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for upload Profile Image with token
 * @param    :
 * @developer   : Manjeet Thakur
 */
authModel.editUploadProfileImageWithToken = async function (userId, fileName) {
  let deferred = q.defer();

  if (userId && fileName) {
    let selectObj = { uc_uuid: userId };
    let updateObj = { uc_profie_image: fileName };

    console.log("selectObj:", selectObj);
    console.log("updateObj:", updateObj);

    try {
      let result = await mongoHelper.updateData(
        selectObj,
        "users_credential",
        updateObj
      );
      console.log(result, "result");
      if (result) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      deferred.resolve(false);
    }
  } else {
    console.log("Invalid userid or fileName");
    deferred.resolve(false);
  }

  return deferred.promise;
};

module.exports = authModel;
