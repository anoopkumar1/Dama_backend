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

const e = require("express");
const mongoHelper = require("../helpers/mongo_helper");
const helper = require("../helpers");

let searchModel = {};

/**
 * for search Blog
 * @param      :
 * @developer   :Manjeet Thakur
 */

searchModel.searchBlog = async (userId, searchKeyWord, body) => {
  try {
    let blogData;
    let totalBlog;
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      b_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    let anothersearchObj = {
      b_deleted: "0",
    };
    const selectObj = {
      b_deleted: "0",
      b_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    const selectObj1 = {
      b_deleted: "0",
    };
    if (searchKeyWord !== "") {
      blogData = await mongoHelper.getpaginatedData(searchObj, "blog", {
        skip,
        limit,
      });
    } else {
      blogData = await mongoHelper.getpaginatedData(anothersearchObj, "blog", {
        skip,
        limit,
      });
    }
    if (searchKeyWord !== "") {
      totalBlog = await mongoHelper.countData(selectObj, "blog");
    } else {
      totalBlog = await mongoHelper.countData(selectObj1, "blog");
    }

    const totalPages = Math.ceil(totalBlog / pageSize);
    if (blogData) {
      blogData.sort((a, b) => {
        return new Date(b.b_created) - new Date(a.b_created);
      });

      return {
        data: blogData,
        currentPage: page,
        totalPages: totalPages,
        totalBlog: totalBlog,
      };
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * for search News
 * @param      :
 * @developer   : Manjeet Thakur
 */

searchModel.searchNews = async (userId, searchKeyWord, body) => {
  try {
    let newsData;
    let totalNews;
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      n_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    const selectObj = {
      n_deleted: "0",
      n_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    let anothersearchObj = {
      n_deleted: "0",
    };

    if (searchKeyWord !== "") {
      newsData = await mongoHelper.getpaginatedData(searchObj, "news", {
        skip,
        limit,
      });
    } else {
      newsData = await mongoHelper.getpaginatedData(anothersearchObj, "news", {
        skip,
        limit,
      });
    }
    if (searchKeyWord !== "") {
      totalNews = await mongoHelper.countData(selectObj, "news");
    } else {
      totalNews = await mongoHelper.countData(anothersearchObj, "news");
    }

    const totalPages = Math.ceil(totalNews / pageSize);
    if (newsData) {
      newsData.sort((a, b) => {
        return new Date(b.n_created) - new Date(a.n_created);
      });

      return {
        data: newsData,
        currentPage: page,
        totalPages: totalPages,
        totalNews: totalNews,
      };
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * for search Event
 * @param      :
 * @developer   : Manjeet Thakur
 */

searchModel.searchEvent = async (userId, searchKeyWord, body) => {
  try {
    let eventData;
    let totalEvents;
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      e_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    const selectObj = {
      e_deleted: "0",
      e_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    let anothersearchObj = {
      e_deleted: "0",
    };
    if (searchKeyWord !== "") {
      eventData = await mongoHelper.getpaginatedData(searchObj, "event", {
        skip,
        limit,
      });
    } else {
      eventData = await mongoHelper.getpaginatedData(
        anothersearchObj,
        "event",
        {
          skip,
          limit,
        }
      );
    }
    if (searchKeyWord !== "") {
      totalEvents = await mongoHelper.countData(selectObj, "event");
    } else {
      totalEvents = await mongoHelper.countData(anothersearchObj, "event");
    }

    const totalPages = Math.ceil(totalEvents / pageSize);
    if (eventData) {
      eventData.sort((a, b) => {
        return new Date(b.e_created) - new Date(a.e_created);
      });

      return {
        data: eventData,
        currentPage: page,
        totalPages: totalPages,
        totalEvents: totalEvents,
      };
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * for search Resources
 * @param      :
 * @developer   : Manjeet Thakur
 */

searchModel.searchResources = async (userId, searchKeyWord, body) => {
  try {
    let resourceData;
    let totalResource;
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      r_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    const selectObj = {
      r_deleted: "0",
      r_title: { $regex: new RegExp(searchKeyWord, "i") },
    };
    let anothersearchObj = {
      r_deleted: "0",
    };
    if (searchKeyWord !== "") {
      resourceData = await mongoHelper.getpaginatedData(searchObj, "resource", {
        skip,
        limit,
      });
    } else {
      resourceData = await mongoHelper.getpaginatedData(
        anothersearchObj,
        "resource",
        {
          skip,
          limit,
        }
      );
    }
    if (searchKeyWord != "") {
      totalResource = await mongoHelper.countData(selectObj, "resource");
    } else {
      totalResource = await mongoHelper.countData(anothersearchObj, "resource");
    }
    const totalPages = Math.ceil(totalResource / pageSize);
    if (resourceData) {
      resourceData.sort((a, b) => {
        return new Date(b.r_created) - new Date(a.r_created);
      });

      return {
        data: resourceData,
        currentPage: page,
        totalPages: totalPages,
        totalResource: totalResource,
      };
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * for search User
 * @param      :
 * @developer   : Manjeet Thakur
 */

searchModel.searchUser = async (userId, searchKeyWord, body) => {
  try {
    console.log("userId", userId);
    let userData;
    let totalUser;
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      $or: [
        { uc_first_name: { $regex: new RegExp(searchKeyWord, "i") } },
        { uc_last_name: { $regex: new RegExp(searchKeyWord, "i") } },
        { uc_middle_name: { $regex: new RegExp(searchKeyWord, "i") } },
      ],
    };

    const selectObj = {
      uc_deleted: "0",
      $or: [
        { uc_first_name: { $regex: new RegExp(searchKeyWord, "i") } },
        { uc_last_name: { $regex: new RegExp(searchKeyWord, "i") } },
        { uc_middle_name: { $regex: new RegExp(searchKeyWord, "i") } },
      ],
    };
    let anothersearchObj = {
      uc_deleted: "0",
    };
    if (searchKeyWord != "") {
      userData = await mongoHelper.getpaginatedData(
        searchObj,
        "users_credential",
        {
          skip,
          limit,
        }
      );
    } else {
      userData = await mongoHelper.getpaginatedData(
        anothersearchObj,
        "users_credential",
        {
          skip,
          limit,
        }
      );
    }
    if (searchKeyWord !== "") {
      totalUser = await mongoHelper.countData(selectObj, "users_credential");
    } else {
      totalUser = await mongoHelper.countData(
        anothersearchObj,
        "users_credential"
      );
    }
    const totalPages = Math.ceil(totalUser / pageSize);
    if (totalUser) {
      userData.sort((a, b) => {
        return new Date(b.uc__created) - new Date(a.uc_created);
      });
      userData = userData.filter((e) => e.uc_uuid !== userId);
      return {
        data: userData,
        currentPage: page,
        totalPages: totalPages,
        totalUser: totalUser,
      };
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

module.exports = searchModel;
