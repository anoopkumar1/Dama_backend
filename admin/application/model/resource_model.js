const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  constants = require("../../../common/config/constants"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");

const resourceModel = {};
/**
 * Insert blog
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
resourceModel.insertResource = async function (body, userId) {
  let deferred = q.defer();
  console.log("body", body);
  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let resourceUuid = v4(Date.now());
    let insertObj = {
      r_uuid: resourceUuid,
      r_adminId: userId,
      r_title: body.title,
      r_description: body.desc,
      r_duplicateDesc: duplicateValue,
      r_price: body.price,
      r_isPaid: body.isPaid,
      r_avgRating,
      r_pdf: "",
      r_image: "",
      r_active: "1",
      r_deleted: "0",
      r_created: date,
      r_updated: date,
    };
    let results = await mongoHelper.insert(insertObj, "resource");
    if (results) {
      deferred.resolve(resourceUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * uploadImage
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
resourceModel.uploadResourceImage = async function (resourceUuid, fileName) {
  let deferred = q.defer();
  if (resourceUuid && fileName) {
    let selectObj = {
      r_uuid: resourceUuid,
    };
    let updateObj = {
      r_image: fileName,
    };
    let result = await mongoHelper.updateData(selectObj, "resource", updateObj);

    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};
/**
 * uploadImage
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
resourceModel.uploadResourcePdf = async function (resourceUuid, fileName) {
  let deferred = q.defer();
  if (resourceUuid && fileName) {
    let selectObj = {
      r_uuid: resourceUuid,
    };
    let updateObj = {
      r_pdf: fileName,
    };
    let result = await mongoHelper.updateData(selectObj, "resource", updateObj);

    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for edit blog
 * @param    :
 * @developer    : Sangeeta
 */
resourceModel.editResource = async function (body, userId) {
  let deferred = q.defer();

  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let blogUuid = v4(Date.now());
    let selectObj = {
      r_uuid: body.blogId,
    };
    let editObj = {
      r_title: body.title,
      r_description: body.desc,
      r_duplicateDesc: duplicateValue,
      r_created: date,
      r_updated: date,
    };
    let results = await mongoHelper.updateData(selectObj, "resource", editObj);

    if (results) {
      deferred.resolve(blogUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for delete blog
 * @param    :
 * @developer    : Sangeeta
 */

resourceModel.deleteResource = async function (body) {
  let deferred = q.defer();

  if (body) {
    let date = await helper.getUtcTime();
    let blogUuid = v4(Date.now());
    let selectObj = {
      r_uuid: body.blogId,
    };
    let editObj = {
      r_deleted: "0",
    };
    let results = await mongoHelper.updateData(selectObj, "resource", editObj);
    if (results) {
      deferred.resolve(blogUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for get all blog
 * @param   :
 * @developer   : Sangeeta
 */

resourceModel.getResource = async function (body) {
  let deferred = q.defer();
  let BlogObj = {
    r_deleted: "0",
  };

  let resourceArray = await mongoHelper.getresourceListData(
    BlogObj,
    "resource",
    body
  );
  if (resourceArray && resourceArray.data && resourceArray.data.length > 0) {
    for (const result of resourceArray.data) {
      result.r_created = helper.dateFormat(result.r_created, "date");
    }
    deferred.resolve(resourceArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

module.exports = resourceModel;
