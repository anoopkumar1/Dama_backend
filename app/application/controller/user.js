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

const helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper"),
  userModel = require("../model/user_model");
let usersObj = {};

/**
 *
 * This function is using to get the user login data
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
usersObj.getLoginUsersData = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  if (userId && req && req.body) {
    let resultOne = await userModel.getLoginUsersData(userId);
    if (resultOne) {
      helper.successHandler(res, {
        payload: resultOne,
      });
    } else {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "E-1000",
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
 *
 * This function is using to get the other user data
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
usersObj.getOtherUserId = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  if (userId) {
    if (req && req.body && req.body.userId) {
      let result = await userModel.getOtherUserId(req.body.userId);

      if (result) {
        helper.successHandler(res, { payload: result });
      } else {
        helper.errorHandler(
          res,
          {
            status: false,
            code: "ZT-E2000",
            message: "Something went wrong.",
            payload: {},
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          status: false,
          code: "ZT-E2000",
          message: "Failed,Please try again.",
          payload: {},
        },
        200
      );
    }
  } else {
    helper.errorHandler(
      res,
      {
        status: false,
        code: "ZT-E2001",
        message: "Unauthorized",
        payload: {},
      },
      200
    );
  }
};

/**
 * this is using for update notification setting
 */

usersObj.updatenotificationSetting = async (req, res) => {
  try {
    let userId = await helper.getUUIDByToken(req);
    if (userId) {
      let result = await userModel.updateNotificationSetting(userId);
      if (result) {
        return res.status(200).json({
          message: "setting updated succesfully",
          code: 200,
          status: true,
          payload: result,
        });
      } else {
        return res.status(200).json({
          message: "error in updation",
          code: 200,
          status: false,
          payload: [],
        });
      }
    } else {
      return res.status(200).json({
        message: "user not authenicated",
        code: 200,
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      message: "error in updating notification",
      code: 200,
      status: false,
      payload: [],
    });
  }
};

/**
 * This function used to get the privacy policy and term and conditions
 * @param     :
 * @returns   :
 * @developer :Anoop kumar
 */
usersObj.getContent = async function (req, res) {
  try {
    if (req.body && req.body.type) {
      let result = await userModel.getContent(req.body, req.body.type);

      if (result) {
        helper.successHandler(res, {
          payload: result,
        });
      } else {
        helper.errorHandler(res, {
          message: "No content found.",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        message: "Type parameter is required.",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.error("Error in getContent:", error);
    helper.errorHandler(res, {
      message: "Something went wrong.",
      status: false,
      payload: [],
    });
  }
};

/**
 * for get about content
 * @param    :
 * @developer  : Manjeet Thakur
 */
usersObj.getAboutContent = async (req, res) => {
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

module.exports = usersObj;
