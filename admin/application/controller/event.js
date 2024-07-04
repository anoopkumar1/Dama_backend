const fs = require("fs"),
  path = require("path"),
  Busboy = require("busboy");
constants = require("../../../common/config/constants");
const helper = require("../helpers/index"),
  eventModel = require("../model/event_model");
const mongoHelper = require("../helpers/mongo_helper");

let eventObj = {};

/**
 * This function is using to insert event
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
eventObj.insertEvent = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (req) {
    if (
      req &&
      req.body &&
      req.body.title &&
      req.body.startDate &&
      req.body.endDate &&
      req.body.venue &&
      req.body.lat &&
      req.body.long &&
      req.body.content &&
      req.body.desc &&
      req.body.subTitle &&
      req.body.isPaid
    ) {
      let results = await eventModel.insertEvent(req.body, user.userId);
      if (results) {
        helper.successHandler(res, {
          payload: {
            eventUuid: results,
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
eventObj.uploadMultipleEventImage = async function (req, res) {
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
      let eventUuid = fields.eventUuid;
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
          let image = await eventModel.uploadMultipleEventImage(
            eventUuid,
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
 * for edit event
 * @param   :
 * @developer    : Sangeeta
 */
eventObj.editEvent = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (
      req &&
      req.body &&
      req.body.title &&
      req.body.content &&
      req.body.desc &&
      req.body.subTitle &&
      req.body.eventId
    ) {
      let results = await eventModel.editEvent(req.body);
      if (results) {
        helper.successHandler(res, {
          payload: {
            eventId: req.body.eventId,
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
 * for delete event
 * @param   :
 * @developer   : Sangeeta
 */
eventObj.deleteEvent = async function (req, res) {
  let user = helper.getUidByToken(req);
  console.log("body", req.body);
  if (req) {
    let results = await eventModel.deleteEvent(req.body, req.body.eventId);
    if (results) {
      helper.successHandler(res, {
        payload: {
          eventUuid: results,
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
 * for get all event
 * @param   :
 * @developer    : Anoop kumar
 */
eventObj.getEventlist = async function (req, res) {
  console.log("list Ajax--------------");
  let user = helper.getUidByToken(req);

  if (req) {
    console.log("list Ajax11111--------------");
    let result = await eventModel.getEventlist(req.body);

    res.render("eventListAjax", {
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
 * for get event by id
 * @param   :
 * @developer   : Sangeeta
 */
eventObj.getEventDataById = async function (req, res) {
  const user = helper.getUidByToken(req);
  const id = req.params.id;
  console.log("id===================", id);
  const selectObj = { e_uuid: id };

  if (id) {
    const data = await mongoHelper.getRow(selectObj, "event");
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

/**
 * upload multiple speakers images
 * @param   :
 * @developer    : Manjeet Thakur
 */
eventObj.uploadMultiplespeakerImage = async function (req, res) {
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
      let eventUuid = fields.eventUuid;
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
          let image = await eventModel.uploadMultiplespeakerImage(
            eventUuid,
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
 * for add event Speaker
 * @param   :
 * @developer   : Manjeet Thakur
 */
eventObj.addSpeaker = async (req, res) => {
  console.log("executed");
  try {
    let { eventId, speakerName } = req.body;
    console.log(req.body,"requestbody");
    if (eventId && speakerName) {
      let addSpeaker = await eventModel.addSpeaker(eventId, speakerName);
      console.log("result",addSpeaker);

      if (addSpeaker) {
        helper.successHandler(res, {
          message: "speaker added succesfully",
          code: "asl-E1002",
          status: true,
          payload: eventId,
        });
      } else {
        helper.errorHandler(res, {
          message: "something went wrong",
          code: "asl-E1002",
          status: false,
          payload: [],
        });
      }
    } else {
      helper.errorHandler(res, {
        message: "all fileds are requried",
        code: "asl-E1002",
        status: false,
        payload: [],
      });
    }
  } catch (error) {
    console.log(error);
    helper.errorHandler(res, {
      message: "something went wrong",
      code: "asl-E1002",
      status: false,
    });
  }
};
module.exports = eventObj;
