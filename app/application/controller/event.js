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

const busboy = require("busboy");
const helper = require("../helpers");
const {
  privacyPolicy,
} = require("../../../website/application/controller/home");
const eventModel = require("../model/event_model");

let eventObj = {};

/**
 * for get event list
 * @param    :
 * @developer    : Manjeet Thakur
 */

eventObj.getEventList = async (req, res) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let eventList = await eventModel.getEventLists(req.body, userId);
      if (
        eventList &&
        eventList.code !== 400 &&
        eventList.code !== 500 &&
        eventList.code !== 404
      ) {
        // console.log(eventList, "eventlist");
        // console.log(formattedDate, "date");
        let formattedEvents = eventList.data.map((event) => {
          // console.log(event.e_endDate > formattedDate);
          let status = event.e_endDate > formattedDate ? "UPCOMING" : "PAST";
          return { ...event, e_status: status };
        });
        helper.successHandler(
          res,
          {
            message: "event list fetched succesfully",

            status: true,
            payload: {
              data: formattedEvents,
              currentPage: eventList.currentPage,
              totalPages: eventList.totalPages,
              totalEvents: eventList.totalEvents,
            },
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
 * for get event by id
 * @param    :
 * @developer   : Manjeet Thakur
 */

eventObj.geteventDetail = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let eventId = req.body.eventId;
      if (eventId) {
        let eventDetail = await eventModel.getEventDetail(eventId, userId);
        if (eventDetail) {
          helper.successHandler(
            res,
            {
              message: "event detail fetched succesfully",

              status: true,
              payload: eventDetail,
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
            message: "event id is missing",
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
    return res.status(400).json({
      message: "error in getting event details",
      code: 400,
      status: false,
      payload: [],
    });
  }
};

/**
 * for book event
 *
 * @param   :
 * @developer    : Manjeet Thakur
 */
eventObj.bookEvent = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      if (req.body.eventId && req.body.type && req.body.amount) {
        let bookevent = await eventModel.bookEvent(userId, req.body, req);
        // console.log(bookevent, "bookevent");
        if (bookevent) {
          helper.successHandler(
            res,
            {
              message: "event booked succesfully",

              status: true,
              payload: {},
            },
            0
          );
        } else {
          helper.errorHandler(
            res,
            {
              message: "error in booking event",
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
            message: "all fields are required",
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
 * for get my events
 * @param    :
 * @developer   : Manjeet Thakur
 */

eventObj.getMyEvents = async (req, res) => {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let getMyEvent = await eventModel.getMyEvent(userId, req.body);
      // console.log(getMyEvent, "my event");
      if (getMyEvent) {
        helper.successHandler(
          res,
          {
            message: "events fetched succesfully",

            status: true,
            payload: getMyEvent,
          },
          200
        );
      } else
        [
          helper.errorHandler(
            res,
            {
              message: "event are not fetched",
              code: "asl-E1002",
              status: false,
              payload: [],
            },
            200
          ),
        ];
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
        message: "somehting went wrong",
        code: "asl-E1002",
        status: false,
        payload: [],
      },
      200
    );
  }
};

/**
 * for get notification list
 * @param    :
 * @developer   : Manjeet Thakur
 */
eventObj.getNotificationList = async (req, res) => {
  try {
    const userId = helper.getUUIDByToken(req);
    if (userId) {
      let notificationlist = await eventModel.getNotificationList(
        userId,
        req.body
      );
      if (notificationlist) {
        helper.successHandler(
          res,
          {
            message: "notification lsit fetched succesfully",

            status: true,
            payload: notificationlist,
          },
          200
        );
      } else {
        helper.errorHandler(
          res,
          {
            message: "error in fetching notification list ",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        );
      }
    } else
      [
        helper.errorHandler(
          res,
          {
            message: "user not authenticated",
            code: "asl-E1002",
            status: false,
            payload: [],
          },
          200
        ),
      ];
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

/*
 * This is used to get combined data
 * @param
 * @returns
 * @developer : Manjeet Thakur
 *
 */
eventObj.getHomeData = async function (req, res) {
  try {
    let userId = helper.getUUIDByToken(req);
    if (userId) {
      let result = await eventModel.getHomeData(req.body, userId);
      return helper.successHandler(res, {
        payload: result,
      });
    } else {
      return helper.errorHandler(res, {
        code: "asl-E1002",
        message: "User not authenticated",
        status: false,
      });
    }
  } catch (error) {
    // console.error("Error in eventObj.getHomeData:", error);
    return helper.errorHandler(
      res,
      {
        code: "AK-E1002",
        message: "Internal server error.",
        status: false,
      },
      200
    );
  }
};

// /**
//  * for get home page combined data
//  * @param     :
//  * @developer   ; Manjeet Thakur
//  */
// eventObj.getCombinedData = async (req, res) => {
//   try {
//     let userId = helper.getUUIDByToken(req);
//     if (userId) {
//       let getCombinedata = await eventModel.getCombinedData(req.body);
//       console.log(
//         getCombinedata,
//         "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
//       );
//       if (getCombinedata) {
//         helper.successHandler(
//           res,
//           {
//             message: "data fetched succesfully",

//             status: true,
//             payload: getCombinedata,
//           },
//           200
//         );
//       } else {
//         helper.errorHandler(
//           res,
//           {
//             message: "error in getting data",
//             code: "asl-E1002",
//             status: false,
//             payload: [],
//           },
//           200
//         );
//       }
//     } else {
//       helper.errorHandler(
//         res,
//         {
//           message: "user not authenticated",
//           code: "asl-E1002",
//           status: false,
//           payload: [],
//         },
//         200
//       );
//     }
//   } catch (error) {
//     console.log(error);
//     helper.errorHandler(
//       res,
//       {
//         message: "something went wrong",
//         code: "asl-E1002",
//         status: false,
//         payload: [],
//       },
//       200
//     );
//   }
// };

/**
 * for upload reciept pdf
 * @param   :
 * @developer  : Manjeet Thakur
 */

eventObj.uploadReciept = async function (req, res) {
  // console.log("start....................", body);

  if (req) {
    const fields = {};
    let conObj = await constants.getConstant();
    let fileObj = null;
    let Busboy = new busboy({ headers: req.headers });

    // Debugging Busboy events
    Busboy.on("field", (fieldname, val) => {
      // console.log(`Field [${fieldname}]: ${val}`);
      fields[fieldname] = val;
    });

    Busboy.on(
      "file",
      (fieldname, file, originalFilename, encoding, mimetype) => {
        // console.log("Uploaded file:", originalFilename);

        let ext = path.extname(originalFilename).toLowerCase();
        if (![".pdf"].includes(ext)) {
          // console.log("Invalid file extension:", ext);
          return false;
        }

        let newName = Date.now() + ext;

        fileObj = {
          fileName: fields.fileName || newName.replace(/ /g, "_"),
          chunks: [],
          encoding: encoding,
          contentType: mimetype,
          uploadFolder: conObj.UPLOAD_PROOF_PATH + conObj.PROFILE_IMAGE_PATH,
        };

        file.on("data", function (data) {
          fileObj.chunks.push(data);
        });

        file.on("end", function () {
          // console.log("File [" + originalFilename + "] Finished");
        });
      }
    );

    Busboy.on("finish", async function () {
      // console.log("Busboy finished uploading");

      if (!fileObj) {
        // console.log("No file uploaded");
        return false;
      }

      try {
        let uploadResult = await helper.uploadFile(fileObj);

        if (uploadResult && uploadResult.Location) {
          let eventId = eventId;
          // console.log("Uploading receipt PDF for event ID:", eventId);

          let image = await eventModel.uploadReciptPdf(
            eventId,
            uploadResult.filename
          );

          if (image) {
            // console.log("Upload successful, image:", image);
            return uploadResult.Location;
          } else {
            // console.log("Failed to upload image");
            return false;
          }
        } else {
          // console.log("Failed to upload file");
          return false;
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        return false;
      }
    });

    // Debugging req.pipe(busboy)
    // console.log("Piping request to Busboy");
    return req.pipe(busboy);
  } else {
    // console.log("Event ID is missing");
    return false;
  }
};

module.exports = eventObj;
