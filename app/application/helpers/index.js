/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 * Written By  : Anoop Kumar <anoop.zeroit@gmail.com>, june 2024
 * Description :
 * Modified By :
 */

let helper = {};
const { async, defer } = require("q");
const q = require("q");

const AWS = require("aws-sdk"),
  fs = require("fs"),
  constants = require("../../../common/config/constants");

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
var emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 *
 * @param:
 * @returns:
 * @developer :
 */

helper.successHandler = function (res, options) {
  let status = "";
  if (options.status == false) {
    status = options.status;
  } else {
    status = true;
  }

  let obj = {
    status: status,
    code: (options && options.code) || "",
    message: (options && options.message) || "Operation performed successfully",
    payload: (options && options.payload) || {},
  };
  res.send(obj);
};

/**
 *
 * @param     :
 * @returns   :
 * @developer :
 */

helper.errorHandler = function (res, options, httpStatuCode = 200) {
  let status = "";

  if (options.status == "") {
    status = options.status;
  } else {
    status = true;
  }
  let obj = {
    status: status || false,
    code: (options && options.code) || "",
    message: (options && options.message) || "Something went wrong",
    payload: (options && options.payload) || {},
  };
  res.status(httpStatuCode).json(obj);
};

helper.errorHandler1 = function (res, options, httpStatusCode = 200) {
  let status = options && options.status !== undefined ? options.status : false;

  let obj = {
    status: status,
    code: options && options.code || "",
    message: options && options.message || "Something went wrong",
    payload: options && options.payload || [],
  };

  res.status(httpStatusCode).json(obj);
};


/**
 * This function is using to return UserId
 * @param     : Token
 * @returns   :
 * @developer :
 */
helper.getUUIDByToken = function (req, uuid = "") {
  let token = "",
    uid = "";

  if (req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else {
      token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    }
  }

  if (token && token != "" && token != "undefined") {
    jwt.verify(
      token,
      "@&*(29783-d4343daf4dd*&@&^#^&@#",
      function (err, decoded) {
        if (err) {
          return false;
        } else {
          if (decoded && decoded.userId) {
            let userUUID = "";
            if (decoded.orgId) {
              userUUID = decoded.orgId;
              if (uuid == "T") {
                uid = decoded.userId;
              } else if (uuid == "E") {
                uid = decoded.email;
              } else {
                uid = decoded.orgId;
              }
            } else {
              if (uuid == "E") {
                uid = decoded.email;
              } else {
                uid = decoded.userId;
              }
            }
          }
        }
      }
    );
  }
  return uid;
};

/**
 * This function is using to change string first letter in capital letter
 * @developer   :
 * @modified    :
 */
helper.capitalizeFirstLetter = function (text) {
  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    return false;
  }
  return text;
};

/**
 * This helper is using to return date into a format
 * @param     : Date
 * @returns   : Date
 * @developer : Diksha
 */
helper.dateFormat = function (date, type = "") {
  if (date != "") {
    let newdate = new Date(date),
      year = newdate.getFullYear(),
      month = newdate.getMonth(),
      dt = newdate.getDate(),
      hours = newdate.getHours(),
      minutes = newdate.getMinutes(),
      ampm = hours >= 12 ? " PM" : " AM";
    if (dt < 10) {
      dt = "0" + dt;
    }
    month = monthNames[month];
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let strTime = hours + ":" + minutes + ampm;
    if (type != "" && type == "date") {
      returnDate = dt + " " + month + ", " + year;
    } else if (type != "" && type == "time") {
      returnDate = strTime;
    } else {
      returnDate = month + " " + dt + ", " + year + ", " + strTime;
    }
    return returnDate;
  }
};


helper.getUtcTime = async function (type) {
  let utcTime = new Date(new Date().toUTCString());
  (dt = utcTime.getDate()),
    (year = utcTime.getFullYear()),
    (month = utcTime.getMonth() + 1),
    (hours = utcTime.getHours()),
    (minutes = utcTime.getMinutes()),
    (second = utcTime.getSeconds());
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  second = second < 10 ? "0" + second : second;
  strTime = hours + ":" + minutes + ":" + second;

  if (dt < 10) {
    dt = "0" + dt;
  }
  month = month < 10 ? "0" + month : month;

  if (type && type != "" && type == "date") {
    returnVal = year + "-" + month + "-" + dt;
    return returnVal;
  } else if (type && type != "" && type == "time") {
    return strTime;
  } else {
    return utcTime;
  }
};

/**
 * This helper is using to add mints in time
 * @developer   :
 * @modified    :
 */
helper.isEmailValid = async function (email) {
  if (!email) {
    return false;
  }

  if (email.length > 254) {
    return false;
  }

  var valid = emailRegex.test(email);

  if (!valid) {
    return false;
  }

  var parts = email.split("@");

  if (parts[0].length > 64) {
    return false;
  }

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return false;
  }

  return true;
};


/**
 * Used to upload file in AWS S3 bucket.
 * @developer   :
 * @modified    :
 * @params      :
 */
helper.uploadFile = async function (fileObj) {
  let defered = q.defer();

  if (fileObj && Object.keys(fileObj).length > 0) {
    let conObj = await constants.getConstant(),
      uploadFolder = "";

    if (fileObj.uploadFolder) {
      uploadFolder = fileObj.uploadFolder;
    }
    const S3 = new AWS.S3({
      accessKeyId: conObj.AWS_ACCESS_KEY,
      secretAccessKey: conObj.AWS_SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: conObj.AWS_BUCKET_NAME, // your s3 bucket name
      Key: uploadFolder + `${fileObj.fileName}`,
      Body: Buffer.concat(fileObj.chunks), // concatinating all chunks
      ACL: "public-read",
      ContentEncoding: fileObj.encoding, // optional
      ContentType: fileObj.contentType, // required
    };
    S3.upload(params, (err, s3res) => {
      if (err) {
        defered.resolve(false);
      } else {
        if (s3res) {
          let resData = s3res;
          defered.resolve(resData);
        } else {
          defered.resolve(false);
        }
      }
    });
  } else {
    defered.resolve(false);
  }

  return defered.promise;
};

helper.uploadThumbnailFile = async function (imageData, fileCon = "VIDEO") {
  let defered = q.defer();

  if (imageData) {
    let conObj = await constants.getConstant();
    const S3 = new AWS.S3({
      accessKeyId: conObj.AWS_ACCESS_KEY,
      secretAccessKey: conObj.AWS_SECRET_ACCESS_KEY,
    });
    let tmpFile = fs.createReadStream("uploads/" + imageData);
    // let tmpFile     =  fs.createReadStream(conObj.UPLOAD_PATH + imageData);
    const params = {
      Bucket: conObj.AWS_BUCKET_NAME,
      Key: conObj.CHAT_MEDIA_FOLDER + `${imageData}`,
      //  Key             : conObj.STAGING_UPLOAD_PATH + conObj.AWS_VIDEO_FOLDER + conObj.AWS_THUMBNAIL_FOLDER + `${imageData}`,
      Body: tmpFile,
      ACL: "public-read",
    };
    if (fileCon == "GROUP") {
      params.Key = conObj.CHAT_MEDIA_FOLDER + `${imageData}`;
      //   params.Key =  conObj.STAGING_UPLOAD_PATH + conObj.UPLOAD_PATH + conObj.GROUP_IMAGE_PATH + `${imageData}`;
    }
    // we are sending buffer data to s3.
    S3.upload(params, async (err, s3res) => {
      if (err) {
        defered.resolve(false);
      } else {
        if (s3res) {
          let fileObj = {
            fileName: imageData,
            folderPath: "./uploads/",
          };
          defered.resolve(imageData);
        } else {
          defered.resolve(false);
        }
      }
    });
  } else {
    defered.resolve(false);
  }

  return defered.promise;
};

/**
 * Used to
 * @developer   :
 * @modified    :
 * @params      :
 */
helper.createReferCode = async function (length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


helper.deliverStatus = async function (loginId, receiverId) {

  let defered = q.defer();
  if (loginId && receiverId) {
    let selectObj = {
      usb_fk_uc_uuid: receiverId,
      usb_block_fk_uc_uuid: loginId,
    };
    let res = await mongoHelper.getData(selectObj, "users_block");
    if (res.length > 0) {

      defered.resolve('0');
    } else {
      defered.resolve('1');
    }
  } else {
    defered.resolve('1');
  }

  return defered.promise;
}


/**
 * This helper is using to calculate distance
 * @developer   :
 * @modified    :
 */
helper.calculateDistance = async function (lat1, lon1, lat2, lon2) {

  const earthRadius = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

module.exports = helper;
