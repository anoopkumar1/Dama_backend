/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  : Anoop <anoop.zeroit@gmail.com>, may 2024
 * Description :
 * Modified By :
 */
const helper = require("../helpers/index"),
  userModel = require("../model/user_model");
const mongoHelper = require("../helpers/mongo_helper");
let userObj = {};

/**
 * This function is using to create users
 * @param     :
 * @returns   :
 * @developer :Anoop Kumar
 */
userObj.insertUser = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (
      req &&
      req.body &&
      req.body.userName &&
      req.body.userLast &&
      req.body.userPassword
    ) {
      let result = await userModel.insertUser(req.body, user.userId);
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
 * This function is using to get the list of all users
 * @param     :
 * @returns   :
 * @developer :Anoop Kumar
 */
userObj.userListAjax = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    let result = await userModel.getuserlist(req.body);
    res.render("userListAjax", {
      req: req,
      data: result,
    });
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};

/**
 * This function is using to delete user by id
 * @param     :
 * @returns   :
 * @developer :Anoop Kumar
 */
userObj.deleteUser = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.userId) {
      let result = await userModel.deleteuser(req.body, user.userId);
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
 * This is using to admin logout
 * @param       :
 * @returns     :
 * @developer   :Anoop Kumar
 */
userObj.adminLogout = async function (req, res) {
  // Clear token cookie
  // res.clearCookie("token");

  // Clear relevant data from local storage
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminImage");

  // Send success response
  helper.successHandler(res, {});
};

/**
 * this is using for edit user
 *
 * @param    :
 * @dveloper    : Anoop
 */

userObj.editUser = async (req, res) => {
  const user = helper.getUidByToken(req);
  if (req) {
    if (
      req &&
      req.body &&
      req.body.userName &&
      req.body.userLast &&
      req.body.userEmail &&
      req.body.userId
    ) {
      let results = await userModel.editUser(req.body);
      if (results) {
        helper.successHandler(res, {
          payload: {
            userUuid: req.body.userId,
          },
        });
      } else {
        helper.errorHandler(res, {
          code: "ASL-E1000",
          message: "Something went wrong.",
          status: false,
        });
      }
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
 * this is using for get member by Id
 * @param    :
 * @developer    : Anoop Kumar
 */

userObj.getuserById = async (req, res) => {
  let user = helper.getUidByToken(req);
  try {
    if (user && user.userId) {
      let memberUuid = req.params.id;
      if (memberUuid) {
        let result = await mongoHelper.getRow(
          { uc_uuid: memberUuid },
          "users_credential"
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
  } catch (error) {}
};

/**
 * This function is using to create users
 * @param     :
 * @returns   :
 * @developer :Anoop Kumar
 */
userObj.insertPayments = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.client_id && req.body.secret) {
      let result = await userModel.insertPaymentSettings(req.body, user.userId);
      if (result) {
        helper.successHandler(res, {});
      } else {
        helper.errorHandler(res, {
          code: "ASL-E1002",
          message: "Failed to insert payment settings.",
          status: false,
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill all mandatory fields.",
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
 * This function is using to create users
 * @param     :
 * @returns   :
 * @developer :Anoop Kumar
 */
userObj.insertStripe = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.publish_key && req.body.api_key) {
      let result = await userModel.insertStripe(req.body, user.userId);
      if (result) {
        helper.successHandler(res, {});
      } else {
        helper.errorHandler(res, {
          code: "ASL-E1002",
          message: "Failed to insert payment settings.",
          status: false,
        });
      }
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill all mandatory fields.",
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
 * for insert about us content
 * @param   :
 * @dveloper   :  Manjeet Thakur
 */

userObj.insertAboutContent = async (req, res) => {
  try {
    let result = await userModel.insertAboutContent(req.body);
    if (result) {
      helper.successHandler(
        res,
        {
          status: true,
          payload: result,
          message: "About content is inserted succesfully",
        },
        200
      );
    } else {
      helper.errorHandler(
        res,
        {
          code: "asl_E1002",
          message: "no data avilable",
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
        message: "something went wrnong",
        status: false,
      },
      200
    );
  }
};

/**
 * for get About us content
 * @param   :
 * @developer  : Manjeet Thakur
 */

userObj.getAboutContent = async (req, res) => {
  try {
    let result = await userModel.getAboutContent();
    if (result) {
      helper.successHandler(
        res,
        {
          status: true,
          message: "data geted succesfully",
          payload: result,
        },
        200
      );
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "no data avilable",
          status: false,
        },
        200
      );
    }
  } catch (error) {
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
module.exports = userObj;
