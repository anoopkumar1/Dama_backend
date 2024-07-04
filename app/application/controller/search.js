/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Manjeet Thakur <manjeet@zeroitsolutions.com>, June 2024
 * Description :
 * Modified By :
 */

const helper = require("../helpers");
const searchModel = require("../model/search_model");

let searchObj = {};

/**
 * for search blogs
 * @param     :
 * @developer   : Manjeet Thakur
 */

searchObj.searchBlog = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let searchKeyword = req.body.searchKeyWord;

      let blogSearchData = await searchModel.searchBlog(
        userId,
        searchKeyword,
        req.body
      );
      if (blogSearchData) {
        return helper.successHandler(
          res,
          {
            code: "asl-E1002",
            message: "blog data search succesfully",
            status: true,
            payload: blogSearchData,
          },
          200
        );
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Error in searching blog",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "unauthorized user",
          status: false,
          payload: {},
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
        message: "Some thing went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};

/**
 * for search news
 * @param     :
 * @developer   : Manjeet Thakur
 */

searchObj.searchNews = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let searchKeyword = req.body.searchKeyWord;

      let newsSearchData = await searchModel.searchNews(
        userId,
        searchKeyword,
        req.body
      );
      if (newsSearchData) {
        return helper.successHandler(
          res,
          {
            code: "asl-E1002",
            message: "News data search succesfully",
            status: true,
            payload: newsSearchData,
          },
          200
        );
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Error in searching News",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "unauthorized user",
          status: false,
          payload: {},
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
        message: "Some thing went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};

/**
 * for search events
 * @param     :
 * @developer   : Manjeet Thakur
 */

searchObj.searchEvents = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let searchKeyword = req.body.searchKeyWord;

      let eventSearchData = await searchModel.searchEvent(
        userId,
        searchKeyword,
        req.body
      );
      if (eventSearchData) {
        return helper.successHandler(
          res,
          {
            code: "asl-E1002",
            message: "Event data search succesfully",
            status: true,
            payload: eventSearchData,
          },
          200
        );
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Error in searching event",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "unauthorized user",
          status: false,
          payload: {},
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
        message: "Some thing went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};

/**
 * for search resources
 * @param     :
 * @developer   : Manjeet Thakur
 */

searchObj.searchResources = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let searchKeyword = req.body.searchKeyWord;

      let resourceSearchData = await searchModel.searchResources(
        userId,
        searchKeyword,
        req.body
      );
      if (resourceSearchData) {
        return helper.successHandler(
          res,
          {
            code: "asl-E1002",
            message: "Resource data search succesfully",
            status: true,
            payload: resourceSearchData,
          },
          200
        );
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Error in searching resource",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "unauthorized user",
          status: false,
          payload: {},
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
        message: "Some thing went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};

/**
 * for search user
 * @param     :
 * @developer   : Manjeet Thakur
 */

searchObj.searchUser = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let searchKeyword = req.body.searchKeyWord;

      let userSearchData = await searchModel.searchUser(
        userId,
        searchKeyword,
        req.body
      );
      if (userSearchData) {
        return helper.successHandler(
          res,
          {
            code: "asl-E1002",
            message: "User data search succesfully",
            status: true,
            payload: userSearchData,
          },
          200
        );
      } else {
        return helper.errorHandler(
          res,
          {
            code: "asl-E1002",
            message: "Error in searching user",
            status: false,
            payload: {},
          },
          200
        );
      }
    } else {
      return helper.errorHandler(
        res,
        {
          code: "asl-E1002",
          message: "unauthorized user",
          status: false,
          payload: {},
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
        message: "Some thing went wrong",
        status: false,
        payload: {},
      },
      200
    );
  }
};
module.exports = searchObj;
