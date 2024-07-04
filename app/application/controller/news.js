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
const helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper"),
  newsModel = require("../model/news_model");
constants = require("../../../common/config/constants");

let newsObj = {};

/**
 *
 * This function is using to get the news details by newsId
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
newsObj.getNewsDetail = async function (req, res) {
  let userId = helper.getUUIDByToken(req);
  if (userId) {
    if (req && req.body && req.body.newsId) {
      let result = await newsModel.getNewsDetail(req.body.newsId, userId);

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
        message: "Unauthorize111111d",
        payload: {},
      },
      200
    );
  }
};

/**
 *
 * This function is using to get the all news list
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */

newsObj.getAllNewsList = async function (req, res) {
  let userId = helper.getUUIDByToken(req);

  if (userId) {
    let result = await newsModel.getAllNewsList(req.body, userId);

    helper.successHandler(res, {
      payload: result,
    });
  } else {
    helper.errorHandler(
      res,
      {
        code: "ASL-E1002",
        message: "Unauthorized Error.",
        status: false,
      },
      200
    );
  }
};

module.exports = newsObj;
