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
const helper = require("../helpers/index"),
  newsModel = require("../model/news_model");
const mongoHelper = require("../helpers/mongo_helper");

let newsObj = {};

/**
 * This function is using to insert news
 * @param     :
 * @returns   :
 * @developer : Manjeet Thakur
 */
newsObj.insertNews = async function (req, res) {
  console.log(req);
  let user = helper.getUidByToken(req);
  console.log("user", user);

  if (user && user.userId) {
    if (
      req &&
      req.body &&
      req.body.title &&
      req.body.content &&
      req.body.desc &&
      req.body.subTitle
    ) {
      let results = await newsModel.insertNews(req.body, user.userId);
      if (results) {
        helper.successHandler(res, {
          payload: {
            newsUuid: results,
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
 * This function is used to upload images in AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer 	:  Manjeet Thakur
 * @modified	:
 */
newsObj.uploadMultiple = async function (req, res) {
  console.log("executed1111111111111111111111111111111111111");
  let userId = helper.getUidByToken(req);
  if (userId) {
    const fields = {};
    let conObj = await constants.getConstant(),
      chunks = [],
      fNames = [],
      fTypes = [],
      fEncodings = [],
      busboy = Busboy({ headers: req.headers });
    busboy.on("field", async (fieldname, val) => {
      fields[fieldname] = val;
    });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      console.log("filename:", filename);
      let ext = path.extname(filename).toLowerCase();
      // let ext = path.extname(filename.filename).toLowerCase(); //live server
      console.log("ext:", ext);

      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".svg" &&
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
        fNames.push(newName.replace(/ /g, "_"));
        fTypes.push(mimetype);
        fEncodings.push(encoding);

        file.on("data", function (data) {
          chunks.push(data);
        });

        file.on("end", function () {
          console.log("File [" + filename + "] Finished");
        });
      }
    });

    busboy.on("finish", async function () {
      let newsUuid = fields.newsUuid;
      let fileObjects = [];
      for (let i = 0; i < fNames.length; i++) {
        let fileObj = {
          fileName: fNames[i],
          chunks: chunks,
          encoding: fEncodings[i],
          contentType: fTypes[i],
          uploadFolder: conObj.UPLOAD_PROOF_PATH + conObj.PROFILE_IMAGE_PATH,
        };
        fileObjects.push(fileObj);
      }

      let promises = fileObjects.map((fileObj) => helper.uploadFile(fileObj));
      console.log("promisespromisespromisespromisespromisespromises", promises);
      let returnObjs = await Promise.all(promises);

      let obj = {};
      if (returnObjs.every(Boolean)) {
        for (let returnObj of returnObjs) {
          returnObj.filename = fNames;
          let image = await newsModel.uploadMultiple(
            newsUuid,
            returnObj.filename
          );
          console.log("imageimageimageimageimageimageimageimageimage", image);
          if (image) {
            let returnRes = "";
            if (returnObj.Location) {
              returnRes = returnObj.Location;
            }
            obj.payload = returnRes;
          }
        }
        helper.successHandler(res, obj);
      } else {
        helper.errorHandler(
          res,
          { message: "Failed to upload one or more images" },
          500
        );
      }
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
  }
};

/**
 *  This function is using for edit news
 * @param   :
 * @developer    : Manjeet Thakur
 */
newsObj.editNews = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (req) {
    if (
      req &&
      req.body &&
      req.body.title &&
      req.body.content &&
      req.body.desc &&
      req.body.subTitle &&
      req.body.newsUuid
    ) {
      console.log(req.body);
      let results = await newsModel.editNews(req.body);
      console.log("result", results);
      if (results) {
        helper.successHandler(res, {
          payload: {
            newsUuid: req.body.newsUuid,
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
 *  This function is using for delete news
 * @param   :
 * @developer   : Manjeet Thakur
 */
newsObj.deleteNews = async function (req, res) {
  console.log("deleteNews function executed");

  let user = helper.getUidByToken(req);
  console.log("User from token:", user);

  if (user && user.userId) {
    console.log("Valid user:", user);
    delete console.log("Request body:", req.body);

    try {
      let results = await newsModel.delete(req.body, req.body.userId);
      console.log("Delete operation results:", results);

      if (results) {
        helper.successHandler(res, {
          payload: {
            newsUuid: results,
          },
        });
      } else {
        console.error("Delete operation failed: No results returned");
        helper.errorHandler(res, {
          code: "ASL-E1000",
          message: "Something went wrong.",
          status: false,
        });
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
      helper.errorHandler(res, {
        code: "ASL-E1001",
        message: "Internal server error.",
        status: false,
      });
    }
  } else {
    console.error("Unauthorized access attempt");
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized error",
      status: false,
    });
  }
};

/**
 *  This function is usingn for get all news
 * @param   :
 * @developer    : Anoop kumar
 */
newsObj.getNewslist = async function (req, res) {
  console.log("list Ajax--------------");
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    console.log("list Ajax11111--------------");
    let result = await newsModel.getNewsList(req.body);

    res.render("managenewsListAjax", {
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
 * This function is using  for get news by id
 * @param   :
 * @developer   : Manjeet Thakur
 */
newsObj.get_news_data_by_id = async function (req, res) {
  try {
    const user = helper.getUidByToken(req);
    if (!user || !user.userId) {
      console.log("Unauthorized access attempt");
      return helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Unauthorized Error.",
        status: false,
      });
    }

    const id = req.params.id;
    console.log("id===================", id);

    if (!id) {
      console.log("No ID provided in request");
      return helper.errorHandler(res, {
        code: "ASL-E1003",
        message: "No ID provided.",
        status: false,
      });
    }

    const selectObj = { n_uuid: id };
    const data = await mongoHelper.getData(selectObj, "news");
    console.log("====================", data);

    if (data && data.length > 0) {
      return helper.successHandler(res, {
        payload: data,
      });
    } else {
      console.log("No data found for the provided ID");
      return helper.errorHandler(res, {
        code: "ASL-E1004",
        message: "No data found.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error fetching news data:", error);
    return helper.errorHandler(res, {
      code: "ASL-E1001",
      message: "Internal Server Error.",
      status: false,
    });
  }
};

module.exports = newsObj;
