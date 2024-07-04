const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  constants = require("../../../common/config/constants"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");

const newsModel = {};
/**
 * @param     :
 * @returns   :
 * @developer :
 */
newsModel.insertNews = async function (body, userId) {
  let deferred = q.defer();

  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let newsUuid = v4(Date.now());
    let insertObj = {
      n_uuid: newsUuid,
      n_adminId: userId,
      n_title: body.title,
      n_content: body.content,
      n_description: body.desc,
      n_duplicateDesc: duplicateValue,
      n_subTitle: body.subTitle,
      n_category: body.category,
      n_image: [],
      n_commentCount: 0,
      n_likeCount: 0,
      n_avgRating: 0,
      n_active: "1",
      n_deleted: "0",
      n_created: date,
      n_updated: date,
    };
    let results = await mongoHelper.insert(insertObj, "news");
    if (results) {
      deferred.resolve(newsUuid);
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
 * @developer :
 */
newsModel.uploadMultiple = async function (newsUuid, fileName) {
  let deferred = q.defer();
  if (newsUuid && fileName) {
    console.log("filename", fileName);
    let selectObj = {
      n_uuid: newsUuid,
    };
    console.log(
      newsUuid,
      "newsUuidnewsUuidnewsUuidnewsUuid",
      fileName,
      "fileNamefileNamefileNamefileNamefileNamefileNamefileName"
    );
    let updateObj = {
      n_image: fileName,
    };
    let result = await mongoHelper.updateData(selectObj, "news", updateObj);
    console.log(
      "resultresultresultresultresultresultresultresultresultresultresult",
      result
    );
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
 * for edit news
 * @param    :
 * @developer    : Manjeet Thakur
 */
newsModel.editNews = async function (body) {
  let deferred = q.defer();

  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let newsUuid = v4(Date.now());
    let selectObj = {
      n_uuid: body.newsUuid,
    };
    let editObj = {
      n_title: body.title,
      n_content: body.content,
      n_description: body.desc,
      n_duplicateDesc: duplicateValue,
      n_subTitle: body.subTitle,
      n_created: date,
      n_updated: date,
      n_category: body.category,
    };
    let results = await mongoHelper.updateData(selectObj, "news", editObj);
    console.log("results", results);
    if (results) {
      deferred.resolve(results);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for delete news
 * @param    :
 * @developer    : Manjeet Thakur
 */

newsModel.delete = async function (body) {
  let deferred = q.defer();
  console.log("req.body", body);
  if (body) {
    let date = await helper.getUtcTime();
    let newsUuid = v4(Date.now());
    let selectObj = {
      n_uuid: body.userId,
    };
    let editObj = {
      n_deleted: "1",
    };
    let results = await mongoHelper.updateData(selectObj, "news", editObj);
    if (results) {
      deferred.resolve(newsUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for get all news
 * @param   :
 * @developer   : Anoop Kumar
 */
newsModel.getNewsList = async function (body) {
  let deferred = q.defer();
  let NewsObj = {
    n_deleted: "0",
  };
  let newsArray = await mongoHelper.getnewsListData(NewsObj, "news", body);
  if (newsArray && newsArray.data && newsArray.data.length > 0) {
    for (const result of newsArray.data) {
      result.n_created = helper.dateFormat(result.n_created, "date");
    }

    deferred.resolve(newsArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

module.exports = newsModel;
