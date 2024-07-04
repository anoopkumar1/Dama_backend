/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Manjeet Thakur <manjeet.zeroitsolutions.com, may 2024
 * Description :
 * Modified By :
 */

const fs = require("fs"),
  path = require("path"),
  Busboy = require("busboy");
constants = require("../../../common/config/constants");
const helper = require("../helpers/index");
const memberModel = require("../model/member_model");
const mongoHelper = require("../helpers/mongo_helper");
const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);
let memberObj = {};

/**
 * this is using for create member
 * @param    :
 * @developer   : Manjeet Thakur
 */

memberObj.createMember = async (req, res) => {
  try {
    const user = helper.getUidByToken(req);

    if (!user || !user.userId) {
      return helper.errorHandler(res, {
        code: "asl-E1002",
        message: "unauthorized",
        status: false,
      });
    }

    const { email } = req.body;

    const validEmail = await helper.isEmailValid(email);
    if (!validEmail) {
      return helper.errorHandler(res, {
        code: "asl-1002",
        message: "enter a valid email",
        status: false,
      });
    }

    const existingEmail = await mongoHelper.getRow(
      { au_email: email },
      "admin_users"
    );
    if (existingEmail) {
      return helper.errorHandler(res, {
        code: "asl-E1003",
        message: "email already exists",
        status: false,
      });
    }

    const result = await memberModel.createMember(req.body);
    console.log(result);
    if (result) {
      return helper.successHandler(res, {
        code: "asl-E1002",
        message: "Member created successfully",
        status: true,
      });
    } else {
      return helper.errorHandler(res, {
        code: "asl-E1004",
        message: "error in creating member",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return helper.errorHandler(res, {
      code: "asl-E1005",
      message: "internal server error",
      status: false,
    });
  }
};

/**
 * this is using for upload member profile image
 * @param    :
 * @developer   : Manjeet Thakur
 */

memberObj.uploadProfileImage = async function (req, res) {
  let userId = helper.getUidByToken(req);
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

        file.on("end", function () {
          console.log("File [" + filename + "] Finished");
        });
      }
    });

    busboy.on("finish", async function () {
      let memberUuid = fields.memberUuid;
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
        let image = memberModel.uploadProfileImage(memberUuid, fName);
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
 * this is using for edit meber
 *
 * @param    :
 * @dveloper    : Manjeet Thakur
 */

memberObj.editMember = async (req, res) => {
  const user = helper.getUidByToken(req);

  try {
    if (user && user.userId) {

      let result = await memberModel.editMember(req.body);
      console.log(result);
      if (result) {
        helper.successHandler(res, {
          code: "asl-E1002",
          message: "Member Updated Succesfully",
          status: true,
        });
      } else {
        helper.errorHandler(res, {
          code: "asl-E1003",
          message: "error in member updation",
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "asl-E1002",
        message: "unauthorozed error",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * this is using for delete meber
 *
 * @param    :
 * @dveloper    : Manjeet Thakur
 */

memberObj.deleteMember = async (req, res) => {
  const user = helper.getUidByToken(req);

  try {
    if (user && user.userId) {
      let result = await memberModel.deleteMember(req.body);
      if (result) {
        helper.successHandler(res, {
          code: "asl-E1002",
          message: "Member Deleted Succesfully",
          status: true,
        });
      } else {
        helper.errorHandler(res, {
          code: "asl-E1003",
          message: "error in member deletion",
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "asl-E1002",
        message: "unauthorozed error",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * this is using for get member by Id
 * @param    :
 * @developer    : Manjeet Thakur
 */

memberObj.getmemberById = async (req, res) => {
  let user = helper.getUidByToken(req);
  try {
    if (user && user.userId) {
      let memberUuid = req.params.id;
      if (memberUuid) {
        let result = await mongoHelper.getRow(
          { au_uuid: memberUuid },
          "admin_users"
        );
        if (result) {
          helper.successHandler(res, {
            code: "asl-E1002",
            message: "data fetched succesfully by id",
            status: true,
            payload: result,
          });
        } else {
          helper.errorHandler(res, {
            code: "asl-E1003",
            message: "error in getting responce",
            status: false,
          });
        }
      } else {
        helper.errorHandler(res, {
          code: "asl-E1004",
          message: "member uuid is required",
          status: false,
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "asl-E1002",
        message: "unauthorized error",
        status: false,
      });
    }
  } catch (error) { }
};

/**
 * this is using for activate member
 * @param    :
 * @developer    : Anoop Kumar
 */

memberObj.activateMember = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.userId) {
      let result = await memberModel.activateMember(req.body, user.userId);
      console.log(result, "99999999999999999999");

      console.log(result, "==========================");
      console.log(result);

      helper.successHandler(res, {});
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
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
 * this is using for deactivate member
 * @param    :
 * @developer    : Anoop Kumar
 */

memberObj.deactivateMember = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.userId) {
      let result = await memberModel.deactivateMember(req.body, user.userId);

      console.log(result);

      helper.successHandler(res, {});
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};

module.exports = memberObj;
