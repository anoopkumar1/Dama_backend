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
const resourceModel = require("../model/resource_model");
constants = require("../../../common/config/constants");

let resourceObj = {};

resourceObj.getAllResourceList = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let result = await resourceModel.getAllResourceList(req.body);
      if (result) {
        helper.successHandler(res, {
          message: "resource list fetched succesfully",
          code: "asl-E1003",
          status: true,
          payload: result,
        });
      } else {
        helper.errorHandler(res, {
          message: "error in getting resource list",
          code: "asl-E1002",
          status: false,
          payload: false,
        });
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenticated",
          code: "asl-E1002",
          status: false,
          payload: [],
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(
      res,
      {
        message: "something went wrong",
        code: "asl-E1002",
        status: false,
        payload: [],
      },
      200
    );
  }
};

/**
 * for purchase resource
 * @param   :
 * @developer    : Manjeet Thakur
 */

resourceObj.purchaseResource = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);

    let result = await resourceModel.purchaseresource(req.body, userId);
    console.log(result);
    if (result) {
      helper.successHandler(
        res,
        {
          message: "resource purchased successfully",
          code: "asl-E1003",
          status: true,
          payload: result,
        },
        200
      );
    } else {
      helper.errorHandler(res, {
        message: "error in purchaseing resource",
        code: "asl-E1002",
        status: false,
        payload: [],
      });
    }
    if (userId) {
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenticated",
          code: "asl-E1002",
          status: false,
          payload: [],
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(
      res,
      {
        message: "something went wrong",
        code: "asl-E1002",
        status: false,
        payload: [],
      },
      200
    );
  }
};

/**
 * for get resourceDetail by id
 * @param    :
 * @developer   : anoop Thakur
 */

resourceObj.getResourcesDetails = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let resourceId = req.body.resourceId;
      if (resourceId) {
        let resourceDetail = await resourceModel.getResourcesDetails(
          resourceId,userId
        );
        if (resourceDetail) {
          helper.successHandler(
            res,
            {
              message: "resource detail fetched succesfully",
              status: true,
              payload: resourceDetail,
            },
            200
          );
        } else {
          helper.errorHandler(
            res,
            {
              message: "Resource not found",
              code: "RESOURCE_NOT_FOUND",
              status: false,
              payload: {},
            },
            200
          );
        }
      } else {
        helper.errorHandler(
          res,
          {
            message: "Resource ID is missing",
            code: "INVALID_RESOURCE_ID",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "User not authenticated",
          code: "UNAUTHENTICATED_USER",
          status: false,
          payload: {},
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(
      res,
      {
        message: "An error occurred while processing your request",
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        payload: {},
      },
      200
    );
  }
};

/**
 * for get my resources
 * @param    :
 * @dveloper     : Manjeet Thakur
 */

resourceObj.getMyResources = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let resources = await resourceModel.getMyResource(req.body,userId);
      if (resources) {
        helper.successHandler(
          res,
          {
            status: true,
            message: "Resources found",
            payload: resources,
          },
          200
        );
      } else {
        helper.errorHandler(
          res,
          {
            status: false,
            code: "asl-E1002",
            message: "No resources found",
            payload: {},
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "User is not authenticated",
          status: false,
          payload: {},
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(
      res,
      {
        code: "asl-E1002",
        message: "Something went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};

module.exports = resourceObj;
