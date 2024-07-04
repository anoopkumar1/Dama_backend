/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 * Written By  : Anoop kumar <anoop.zeroit@gmail.com>, June 2024
 * Description :
 * Modified By :
 */
const q = require("q"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");
const newsModel = {};

/**
 *
 * This function is using to get the news details by newsId
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
newsModel.getNewsDetail = async function (newsId, userId) {
  let deferred = q.defer();
  let result = await mongoHelper.getData({ n_uuid: newsId }, "news");
  let searchObj = {
    l_id: newsId,
    l_us_id: userId,
  };
  let data = await mongoHelper.getData(searchObj, "like_data");
  result[0].n_likedByMe = data.length > 0 ? 1 : 0;

  deferred.resolve(result);
  return deferred.promise;
};

/**
 *
 * This function is using to get the all news list
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
newsModel.getAllNewsList = async function (body, userId) {
  try {
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }

    const selectObj = {
      n_deleted: "0",
    };

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    let newsList = await mongoHelper.getpaginatedData(selectObj, "news", {
      skip,
      limit,
    });

    const totalNews = await mongoHelper.countData(selectObj, "news");
    const totalPages = Math.ceil(totalNews / pageSize);

    newsList.sort((a, b) => {
      return new Date(b.n_created) - new Date(a.n_created);
    });

    for (let news of newsList) {
      const newsId = news.n_uuid;
      let adminId = news.n_adminId;
      const searchObj = {
        l_id: newsId,
        l_us_id: userId,
      };
      let searchObj1 = {
        au_uuid: adminId,
      };

      const [likeData, adminData] = await Promise.all([
        mongoHelper.getData(searchObj, "like_data"),
        mongoHelper.getData(searchObj1, "admin_users"),
      ]);
      news.n_likedByMe = likeData.length > 0 ? 1 : 0;
      news.n_admimName =
        adminData[0].au_firstname + " " + adminData[0].au_lastname;
      news.n_role =
        adminData[0].au_role === "SUPER_ADMIN"
          ? "Super Admin"
          : adminData[0].au_role === "ADMIN"
          ? "Admin"
          : adminData[0].au_role === "MANAGER"
          ? "Manager"
          : adminData[0].au_role === "EDITOR"
          ? "Editor"
          : "";
      news.n_adminImage = adminData[0].au_profileImage || "";
    }

    return {
      data: newsList,
      currentPage: page,
      totalPages: totalPages,
      totalNews: totalNews,
    };
  } catch (error) {
    return { error: "Internal server error", code: 500 };
  }
};

module.exports = newsModel;
