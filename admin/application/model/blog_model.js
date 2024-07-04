const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  constants = require("../../../common/config/constants"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");

const blogModel = {};
/**
 * Insert blog
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
blogModel.insertBlog = async function (body, userId) {
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
    let insertObj = {
      b_uuid: blogUuid,
      b_adminId: userId,
      b_title: body.title,
      b_content: body.content,
      b_description: body.desc,
      b_duplicateDesc: duplicateValue,
      b_subTitle: body.subTitle,
      b_image: "",
      b_commentCount: 0,
      b_avgRating: 0,
      b_likeCount: 0,
      b_active: "1",
      b_deleted: "0",
      b_created: date,
      b_updated: date,
    };
    let results = await mongoHelper.insert(insertObj, "blog");
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
 * uploadImage
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
blogModel.uploadBlogImage = async function (blogUuid, fileName) {
  let deferred = q.defer();
  if (blogUuid && fileName) {
    let selectObj = {
      b_uuid: blogUuid,
    };
    let updateObj = {
      b_image: fileName,
    };
    let result = await mongoHelper.updateData(selectObj, "blog", updateObj);

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
blogModel.editBlog = async function (body, userId) {
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
      b_uuid: body.blogId,
    };
    let editObj = {
      b_title: body.title,
      b_content: body.content,
      b_description: body.desc,
      b_duplicateDesc: duplicateValue,
      b_subTitle: body.subTitle,
      b_created: date,
      b_updated: date,
    };
    let results = await mongoHelper.updateData(selectObj, "blog", editObj);
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

blogModel.deleteBlog = async function (body) {
  let deferred = q.defer();

  if (body) {
    let date = await helper.getUtcTime();
    let blogUuid = v4(Date.now());
    let selectObj = {
      b_uuid: body.blogId,
    };
    let editObj = {
      b_deleted: "1",
    };
    let results = await mongoHelper.updateData(selectObj, "blog", editObj);
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

blogModel.getBlog = async function (body) {
  let deferred = q.defer();
  let BlogObj = {
    b_deleted: "0",
  };

  let blogArray = await mongoHelper.getblogListData(BlogObj, "blog", body);
  if (blogArray && blogArray.data && blogArray.data.length > 0) {
    for (const result of blogArray.data) {
      result.b_created = helper.dateFormat(result.b_created, "date");
    }
    deferred.resolve(blogArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

module.exports = blogModel;
