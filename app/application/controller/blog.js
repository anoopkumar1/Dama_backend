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
const blogModel = require("../model/blog_model");
const resourceObj = require("./resoure");

let blogObj = {};
/**
 * This is for post blog comment
 * @param      :
 * @developer    : Manjeet Thakur
 */

blogObj.postComment = async (req, res) => {
  let userId = helper.getUUIDByToken(req);
  try {
    let { Id, comment, type } = req.body;
    if (userId) {
      if (Id && comment && type) {
        let Comment = await blogModel.insertComment(Id, comment, userId, type);
        // console.log(Comment, "blogcomment");
        if (Comment) {
          helper.successHandler(
            res,
            {
              message: "comment posted succesfully",
              status: true,
              payload: {},
            },
            200
          );
        } else {
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
      } else {
        helper.errorHandler(
          res,
          {
            message: "please provide all required fields",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        );
      }
    } else {
      helper.errorHandler(res, {
        message: "user not authenicated",
        code: "asl-E1002",
        status: false,
        payload: [],
      });
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
 * for read comment or get comment list by blogId
 * @param    :
 * @developer  : Manjeet Thakur
 */

blogObj.readComment = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    let { Id, type } = req.body;
    if (userId) {
      if (Id) {
        let List = await blogModel.getCommentListById(Id, type);
        if (List) {
          helper.successHandler(
            res,
            {
              message: "comment list succesfully fetched",
              status: true,
              payload: List,
            },
            200
          );
        } else {
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
      } else {
        helper.errorHandler(res, {
          message: "Id is missing",
          code: "asl-E1002",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenicated",
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
 * for get blog list
 * @param    :
 * @developer    : Manjeet Thakur
 */

blogObj.getBlogList = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let blogList = await blogModel.getBlogList(req.body,userId);
      if (blogList) {
        helper.successHandler(
          res,
          {
            message: "blog list fetched succesfully",

            status: true,
            payload: blogList,
          },
          200
        );
      } else {
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
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenicated",
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
 * for get BlogDetail by id
 * @param    :
 * @developer   : Manjeet Thakur
 */

blogObj.getBlogDetails = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    
    if (userId) {
      let blogId = req.body.blogId;
      if (blogId) {
        let blogDetail = await blogModel.getBlogDetails(blogId,userId);
        if (blogDetail) {
          helper.successHandler(
            res,
            {
              message: "blog detail fetched succesfully",

              status: true,
              payload: blogDetail,
            },
            200
          );
        } else {
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
      } else {
        helper.errorHandler(
          res,
          {
            message: "is id missing",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenicated",
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
        payload: [],
      },
      200
    );
  }
};





/**
 * for rate article
 * @param   :
 * @developer    : Manjeet Thakur
 */
blogObj.giverating = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      if (req.body.rating && req.body.id && req.body.type) {
        let giveRating = await blogModel.giveRating(
          req.body.rating,
          req.body.id,
          req.body.comment,
          userId,
          req.body.type
        );
        if (giveRating) {
          helper.successHandler(
            res,
            {
              message: "article rated succesfully",

              status: true,
              payload: {},
            },
            200
          );
        } else {
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
      } else {
        helper.errorHandler(
          res,
          {
            message: "fill all mandatory field",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "user not authenicated",
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
        payload: [],
      },
      200
    );
  }
};

/**
 * like blog or news
 * @param    :
 * @developer    : Manjeet Thakur
 */

blogObj.like = async (req, res) => {
  let userId = helper.getUUIDByToken(req);
  try {
    let { Id, type } = req.body;
    if (userId) {
      if (Id && type) {
        let like = await blogModel.like(Id, type,userId);
        // console.log(like, "like");
        if (like) {
          helper.successHandler(
            res,
            {
              message: "like posted succesfully",

              status: true,
              payload: {},
            },
            200
          );
        } else {
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
      } else {
        helper.errorHandler(
          res,
          {
            message: "fill all mandatory fields",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        );
      }
    } else {
      helper.errorHandler(
        res,
        {
          message: "please provide all required fields",
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

module.exports = blogObj;
