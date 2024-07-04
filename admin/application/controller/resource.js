const fs = require("fs"),
  path = require("path"),
  Busboy = require("busboy");
constants = require("../../../common/config/constants");
const helper = require("../helpers/index"),
  resource = require("../model/resource_model");
const mongoHelper = require("../helpers/mongo_helper");
const resourceModel = require("../model/resource_model");

let resourceObj = {};

/**
 * This function is using to insert Resource
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
resourceObj.insertResource = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (req) {
    if (req && req.body && req.body.title) {
      let results = await resourceModel.insertResource(req.body, user.userId);
      if (results) {
        helper.successHandler(res, {
          payload: {
            resourceUuid: results,
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
 * @developer 	:
 * @modified	:
 */
resourceObj.uploadResourceImage = async function (req, res) {
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
      let resourceUuid = fields.resourceUuid;
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
          let image = await resourceModel.uploadResourceImage(
            resourceUuid,
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
 * This function is used to upload PDF files to an AWS S3 bucket.
 * @param     	:
 * @returns   	:
 * @developer 	:
 * @modified	:
 */
resourceObj.uploadResourcePdf = async function (req, res) {
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

      if (ext !== ".pdf") {
        let obj = {
          status: true,
          code: "",
          message: "Invalid file type! Only PDF files are allowed.",
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
      let resourceUuid = fields.resourceUuid;
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
          let image = await resourceModel.uploadResourcePdf(
            resourceUuid,
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
          { message: "Failed to upload one or more PDF files" },
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
 * for edit news
 * @param   :
 * @developer    : Sangeeta
 */
resourceObj.editResource = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (req) {
    if (req && req.body && req.body.title && req.body.blogId) {
      let results = await resourceModel.editResource(req.body);
      if (results) {
        helper.successHandler(res, {
          payload: {
            resourceUuid: req.body.blogId,
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
 * for delete news
 * @param   :
 * @developer   : Sangeeta
 */
resourceObj.deleteResource = async function (req, res) {
  let user = helper.getUidByToken(req);
  if (req) {
    let results = await resourceModel.deleteResource(req.body, req.body.blogId);
    console.log(results, "============================");
    if (results) {
      helper.successHandler(res, {
        payload: {
          blogUuid: results,
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
      message: "unauthorized error",
      status: false,
    });
  }
};

/**
 * for get all news
 * @param   :
 * @developer    : Sangeeta
 */
resourceObj.getResourcelist = async function (req, res) {
  console.log("list Ajax--------------");
  let user = helper.getUidByToken(req);

  if (req) {
    console.log("list Ajax11111--------------");
    let result = await resourceModel.getResource(req.body);

    res.render("resourceListAjax", {
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
 * for get blog by id
 * @param   :
 * @developer   : Sangeeta
 */
resourceObj.getResourceDataById = async function (req, res) {
  const user = helper.getUidByToken(req);
  const id = req.params.id;
  console.log("id===================", id);
  const selectObj = { r_uuid: id };

  if (id) {
    const data = await mongoHelper.getRow(selectObj, "resource");
    console.log("====================", data);
    if (data) {
      return helper.successHandler(res, {
        payload: data,
      });
    }
  }

  return helper.errorHandler(res, {
    code: "ASL-E1002",
    message: "Unauthorized Error.",
    status: false,
  });
};
module.exports = resourceObj;
