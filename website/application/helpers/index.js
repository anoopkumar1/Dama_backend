/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Rohit kumar <rohit.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */

let helper = {};
const q = require("q");

const AWS = require('aws-sdk'),
  constants = require('../../../common/config/constants')

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
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

helper.errorHandler = function (res, options, httpStatuCode = 501) {
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
    payload: (options && options.payload) || [],

  };
  res.status(httpStatuCode).json(obj);
};


/**
 * This function is using to return UserId
 * @param     : Token
 * @returns   : 
 * @developer :
 */
helper.getUUIDByToken = function (req, uuid = '') {
  let token = '',
    uid = '';

  if (req) {

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {

      token = req.query.token;
    } else {

      token = req.body.token || req.query.token || req.headers['x-access-token'];
    }

  }

  if (token && token != '' && token != 'undefined') {

    jwt.verify(token, '@&*(29783-d4343daf4dd*&@&^#^&@#', function (err, decoded) {

      if (err) {
        return false
      } else {

        if (decoded && decoded.userId) {
          let userUUID = '';
          if (decoded.orgId) {

            userUUID = decoded.orgId;
            if (uuid == 'T') {
              uid = decoded.userId;
            } else if (uuid == 'E') {
              uid = decoded.email;
            } else {
              uid = decoded.orgId;
            }
          } else {

            if (uuid == 'E') {
              uid = decoded.email;
            } else {
              uid = decoded.userId;
            }
          }
        }
      }
    });
  }
  return uid;
}
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
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let strTime = hours + ":" + minutes + ampm;
    if (type != "" && type == 'date') {
      returnDate = dt + " " + month + ", " + year;
    } else if (type != "" && type == 'time') {
      returnDate = strTime;
    } else {
      returnDate = month + " " + dt + ", " + year + ", " + strTime;
    }
    return returnDate;
  }
};

/**
 * This helper is using to get utc time
 * @param     : 
 * @returns   : 
 * @developer : 
 */
helper.getUtcTime = async function (type) {

  let utcTime = new Date(new Date().toUTCString());
  dt = utcTime.getDate(),
    year = utcTime.getFullYear(),
    month = utcTime.getMonth() + 1,
    hours = utcTime.getHours(),
    minutes = utcTime.getMinutes(),
    second = utcTime.getSeconds();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  second = second < 10 ? '0' + second : second;
  strTime = hours + ':' + minutes + ':' + second;

  if (dt < 10) {
    dt = '0' + dt;
  }
  month = month < 10 ? '0' + month : month;

  if (type && type != '' && type == 'date') {
    returnVal = year + '-' + month + '-' + dt;
    return returnVal;
  } else if (type && type != '' && type == 'time') {
    return strTime;
  } else {
    return utcTime;
  }
}

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

  // Further checking of some things regex can't handle
  var parts = email.split("@");

  if (parts[0].length > 64) {
    return false;
  }

  var domainParts = parts[1].split(".");
  if (domainParts.some(function (part) {
    return part.length > 63;
  })) {
    return false;
  }

  return true;

}
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
      uploadFolder = '';
    if (fileObj.uploadFolder) {
      uploadFolder = fileObj.uploadFolder;
    }
    const S3 = new AWS.S3({
      accessKeyId: conObj.AWS_ACCESS_KEY,
      secretAccessKey: conObj.AWS_SECRET_ACCESS_KEY

    });
    const params = {
      Bucket: conObj.AWS_BUCKET_NAME, // your s3 bucket name
      Key: uploadFolder + `${fileObj.fileName}`,
      Body: Buffer.concat(fileObj.chunks), // concatinating all chunks
      ACL: 'public-read',
      ContentEncoding: fileObj.encoding, // optional
      ContentType: fileObj.contentType // required
    };
    // we are sending buffer data to s3.
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
}
/**
 * This helper is using to add mints in time
 * @developer   :
 * @modified    :
 */
helper.getUtcYesterdayDate = async function () {

  let date = await helper.getUtcTime('date');
  let time = await helper.getUtcTime('time');

  let d = new Date(date + " " + time);
  newDate = d.setDate(d.getDate() - 1);
  year = d.getFullYear();
  month = d.getMonth() + 1,
    dt = d.getDate();
  if (dt < 10) {
    dt = '0' + dt;
  }
  month = month < 10 ? '0' + month : month;


  returnVal = year + '-' + month + '-' + dt;

  return returnVal;

}

/**
 * Used to delete file from AWS S3 bucket.
 * @developer   : 
 * @modified    :
 * @params      : fileObj { fileName, folderName }
 */
helper.deleteAWSFile = async function (fileObj) {

  let defered = q.defer();

  if (fileObj && fileObj.fileName) {

    let fileName = fileObj.fileName,
      folderName = '';

    if (fileObj.folderName) {
      folderName = fileObj.folderName;
    }

    let conObj = await constants.getConstant(),
      s3 = new AWS.S3({
        accessKeyId: conObj.AWS_ACCESS_KEY,
        secretAccessKey: conObj.AWS_SECRET_ACCESS_KEY
      }),

      params = {
        Bucket: conObj.AWS_BUCKET_NAME,
        Key: folderName + fileName
      };
    s3.deleteObject(params, function (err, data) {

      if (err) {
        defered.resolve(false);
      } else {
        defered.resolve(true);
      }

    });

  } else {
    defered.resolve(false);
  }

  return defered.promise;
}
/**
 * Used to 
 * @developer   : 
 * @modified    :
 * @params      : 
 */
helper.createReferCode = async function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

/**
 * This helper is using to get utc time
 * @param     : 
 * @returns   : 
 * @developer : 
 */
helper.getUtcTimeBefore = async function () {

  let utcTime = new Date(new Date().toUTCString());
  utcTime = utcTime.setMinutes(utcTime.getMinutes() - 2);

  return utcTime;

}
module.exports = helper;