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
const resourceModel = require("./resource_model");

let blogModel = {};
/**
 * This is for post blog comment
 * @param      :
 * @developer    : Manjeet Thakur
 */

blogModel.insertComment = async (Id, comment, userId, type) => {
  try {
    if (Id && comment && userId && type) {
      let Count;
      if (type === "BLOG") {
        let blogComment = await mongoHelper.getData({ b_uuid: Id }, "blog");
        if (blogComment && blogComment.length > 0) {
          Count = parseInt(blogComment[0].b_commentCount);
          Count++;
          // // // // // console.log(`New blog comment count: ${Count}`);

          let updateCount = await mongoHelper.updateData(
            { b_uuid: Id },
            "blog",
            { b_commentCount: Count }
          );
          // // // // // console.log(updateCount, "updateCount for blog");
        }
      } else if (type === "NEWS") {
        let newsComment = await mongoHelper.getData({ n_uuid: Id }, "news");
        if (newsComment && newsComment.length > 0) {
          Count = parseInt(newsComment[0].n_commentCount);
          Count++;
          // // // // // console.log(`New news comment count: ${Count}`);

          let updateCount = await mongoHelper.updateData(
            { n_uuid: Id },
            "news",
            { n_commentCount: Count }
          );
          // // // // // console.log(updateCount, "updateCount for news");
        }
      }

      let insertObj = {
        _uuid: Id,
        _comment: comment,
        _user_id: userId,
        _type: type,
      };
      // // // // // console.log(insertObj, "insertobj");
      let result = await mongoHelper.insert(insertObj, "comment");
      // // // // // console.log(result, "result of insert");

      return result ? result : false;
    } else {
      // // // // // console.log("Missing parameters");
      return false;
    }
  } catch (error) {
    // // // // // console.log(error, "error in insertComment");
    return false;
  }
};

/**
 * for get comment list
 * @param    :
 * @developer   : Manjeet Thakur
 */

blogModel.getCommentListById = async (Id, type) => {
  try {
    if (Id) {
      let searchObj = {
        _uuid: Id,
        _type: type,
      };
      let result = await mongoHelper.getData(searchObj, "comment");
      if (result) {
        result.sort((a, b) => {
          return b - a;
        });
        return result;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // // // // // console.log(error);
    return false;
  }
};

/**
 * for get blog list
 * @param   :
 * @developer   : Manjeet Thakur
 */
blogModel.getBlogList = async (body, userId) => {
  try {
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      b_deleted: "0",
    };

    let result = await mongoHelper.getpaginatedData(searchObj, "blog", {
      skip,
      limit,
    });

    if (result) {
      const totalBlog = await mongoHelper.countData(searchObj, "blog");
      const totalPages = Math.ceil(totalBlog / pageSize);

      for (let blog of result) {
        const blogId = blog.b_uuid;
        const adminId = blog.b_adminId;
        const searchObj = {
          l_id: blogId,
          l_us_id: userId,
        };
        let searchObj1 = {
          au_uuid: adminId,
        };
        let [data, adminData] = await Promise.all([
          mongoHelper.getData(searchObj, "like_data"),
          mongoHelper.getData(searchObj1, "admin_users"),
        ]);

        blog.b_likedByMe = data.length > 0 ? 1 : 0;
        blog.b_admimName =
          adminData[0].au_firstname + " " + adminData[0].au_lastname;
        blog.b_role =
          adminData[0].au_role === "SUPER_ADMIN"
            ? "Super Admin"
            : adminData[0].au_role === "ADMIN"
            ? "Admin"
            : adminData[0].au_role === "MANAGER"
            ? "Manager"
            : adminData[0].au_role === "EDITOR"
            ? "Editor"
            : "";
        blog.b_adminImage = adminData[0].au_profileImage || "";
      }

      return {
        data: result,
        currentPage: page,
        totalPages: totalPages,
        totalBlog: totalBlog,
      };
    } else {
      return false;
    }
  } catch (error) {
    // // // // // // console.log(error);
    return false;
  }
};

/**
 * for get blog detailsById
 * @param    :
 * @developer   :  Manjeet Thakur
 */

blogModel.getBlogDetails = async (blogId, userId) => {
  // // // // // console.log("userId", userId);
  try {
    if (!blogId) {
      return false;
    }

    let searchObj = {
      b_uuid: blogId,
    };

    let BlogDetails = await mongoHelper.getData(searchObj, "blog");

    if (!BlogDetails || BlogDetails.length === 0) {
      return false;
    }

    if (userId) {
      let searchObj1 = {
        l_id: blogId,
        l_us_id: userId,
      };
      // // // // // console.log(searchObj1, "searchobj");
      let data = await mongoHelper.getData(searchObj1, "like_data");
      // // // // // console.log("data", data);
      BlogDetails[0].b_likedByMe = data.length > 0 ? 1 : 0;
    } else {
      BlogDetails[0].b_likedByMe = 0;
    }

    return BlogDetails;
  } catch (error) {
    // // // // // console.error("Error in getBlogDetails:", error);
    return false;
  }
};

/**
 * for rate article
 * @param   :
 * @developer   : Manjeet Thakur
 */

blogModel.giveRating = async (rating, id, comment, userId, type) => {
  try {
    // // // // // console.log("executed");
    let average = 0;
    let totalAverage;
    let insertObj = {
      _uuid: userId,
      _ruuid: id,
      _rating: rating,
      _comment: comment,
      _type: type,
    };
    let rateArticle = await mongoHelper.insert(insertObj, "rating");
    if (rateArticle) {
      if (type === "BLOG") {
        // // // // // console.log(`type ${type}`);
        let searchObj = {
          _ruuid: id,
          _type: type,
        };
        // // // // // console.log(searchObj, "search obj");
        let blogResult = await mongoHelper.getData(searchObj, "rating");
        // // // // // console.log("blogresult", blogResult);
        if (blogResult && blogResult.length > 0) {
          blogResult.forEach((data) => {
            average += parseInt(data._rating);
            // // // // // console.log(average, "average");
          });
          totalAverage = average / blogResult.length;
          // // // // // console.log("totalaverage", totalAverage);
          let updateAverageRating = await mongoHelper.updateData(
            { b_uuid: id },
            "blog",
            { b_avgRating: totalAverage }
          );
          // // // // // console.log(updateAverageRating, "updateAverageRating");
        }
      } else if (type === "NEWS") {
        // // // // // console.log(`type ${type}`);
        let searchObj = {
          _ruuid: id,
          _type: type,
        };
        // // // // // console.log(searchObj, "search obj");
        let newsResult = await mongoHelper.getData(searchObj, "rating");
        // // // // // console.log("newsResult", newsResult);
        if (newsResult && newsResult.length > 0) {
          newsResult.forEach((data) => {
            average += parseInt(data._rating);
            // // // // // console.log(average, "average");
          });
          totalAverage = average / newsResult.length;
          // // // // // console.log("totalaverage", totalAverage);
          let updateAverageRating = await mongoHelper.updateData(
            { n_uuid: id },
            "news",
            { n_avgRating: totalAverage }
          );
          // // // // // console.log(updateAverageRating, "updateAverageRating");
        }
      } else if (type === "EVENT") {
        // // // // // console.log(`type ${type}`);
        let searchObj = {
          _ruuid: id,
          _type: type,
        };
        // // // // // console.log(searchObj, "search obj");
        let eventResult = await mongoHelper.getData(searchObj, "rating");
        // // // // // console.log("eventResult", eventResult);
        if (eventResult && eventResult.length > 0) {
          eventResult.forEach((data) => {
            average += parseInt(data._rating);
            // // // // // console.log(average, "average");
          });
          totalAverage = average / eventResult.length;
          // // // // // console.log("totalaverage", totalAverage);
          let updateAverageRating = await mongoHelper.updateData(
            { e_uuid: id },
            "event",
            { e_avgRating: totalAverage }
          );
          // // // // // console.log(updateAverageRating, "updateAverageRating");
        }
      } else {
        // // // // // console.log(`type ${type}`);
        let searchObj = {
          _ruuid: id,
          _type: type,
        };
        // // // // // console.log(searchObj, "search obj");
        let resourceResult = await mongoHelper.getData(searchObj, "rating");
        // // // // // console.log("resourceResult", resourceResult);
        if (resourceResult && resourceResult.length > 0) {
          resourceResult.forEach((data) => {
            average += parseInt(data._rating);
            // // // // // console.log(average, "average");
          });
          totalAverage = average / resourceResult.length;
          // // // // // console.log("totalaverage", totalAverage);
          let updateAverageRating = await mongoHelper.updateData(
            { r_uuid: id },
            "resource",
            { r_avgRating: totalAverage }
          );
          // // // // // console.log(updateAverageRating, "updateAverageRating");
        }
      }
      return rateArticle;
    } else {
      return false;
    }
  } catch (error) {
    // // // // // console.log(error);
    return false;
  }
};

/**
 * for insert like
 *
 * @param    :
 * @developer : Manjeet Thakur
 */

blogModel.like = async (Id, type, userId) => {
  try {
    let Count;

    if (type === "BLOG") {
      // // // // // console.log(`Fetching blog with ID: ${Id}`);

      const [blogLikeCount, likeData] = await Promise.all([
        mongoHelper.getData({ b_uuid: Id }, "blog"),
        mongoHelper.getData(
          { l_id: Id, l_us_id: userId, l_type: type },
          "like_data"
        ),
      ]);
      // // // // // console.log(likeData, "likeData");
      if (likeData && likeData.length > 0) {
        if (blogLikeCount && blogLikeCount.length > 0) {
          Count = parseInt(blogLikeCount[0].b_likeCount);
          // // // // // console.log(`Current blog like count: ${Count}`);
          Count--;

          // // // // // console.log(`New blog like count: ${Count}`);

          const updateLikeCountOfBlog = await mongoHelper.updateData(
            { b_uuid: Id },
            "blog",
            { b_likeCount: Count }
          );
          // // // // // console.log("updateLikeCountOfBlog:", updateLikeCountOfBlog);

          if (updateLikeCountOfBlog) {
            const data = await mongoHelper.deleteData(
              { l_id: Id, l_us_id: userId, l_type: type },
              "like_data"
            );
            if (data) {
              // // // // // console.log("Like data deleted successfully");
            }
            return updateLikeCountOfBlog;
          } else {
            return false;
          }
        }
      } else {
        if (blogLikeCount && blogLikeCount.length > 0) {
          Count = parseInt(blogLikeCount[0].b_likeCount);
          // // // // // console.log(`Current blog like count: ${Count}`);
          Count++;

          // // // // // console.log(`New blog like count: ${Count}`);

          const updateLikeCountOfBlog = await mongoHelper.updateData(
            { b_uuid: Id },
            "blog",
            { b_likeCount: Count }
          );
          // // // // // console.log("updateLikeCountOfBlog:", updateLikeCountOfBlog);

          if (updateLikeCountOfBlog) {
            const data = await mongoHelper.insert(
              { l_id: Id, l_us_id: userId, l_type: type },
              "like_data"
            );
            if (data) {
              // // // // // console.log("Like data inserted successfully");
            }
            return updateLikeCountOfBlog;
          } else {
            return false;
          }
        }
      }
    } else if (type === "NEWS") {
      // // // // // console.log(`Fetching news with ID: ${Id}`);

      const [newsLikeCount, likeData] = await Promise.all([
        mongoHelper.getData({ n_uuid: Id }, "news"),
        mongoHelper.getData(
          { l_id: Id, l_us_id: userId, l_type: type },
          "like_data"
        ),
      ]);

      // // // // // console.log("newsLikeCount:", newsLikeCount);
      // // // // // console.log(likeData, "likeData");
      if (likeData && likeData.length > 0) {
        if (newsLikeCount && newsLikeCount.length > 0) {
          Count = parseInt(newsLikeCount[0].n_likeCount);
          // // // // // console.log(`Current news like count: ${Count}`);
          Count--;

          // // // // // console.log(`New news like count: ${Count}`);

          const updateLikeCountOfNews = await mongoHelper.updateData(
            { n_uuid: Id },
            "news",
            { n_likeCount: Count }
          );
          // // // // // console.log("updateLikeCountOfNews:", updateLikeCountOfNews);

          if (updateLikeCountOfNews) {
            const data = await mongoHelper.deleteData(
              { l_id: Id, l_us_id: userId, l_type: type },
              "like_data"
            );
            if (data) {
              // // // // // console.log("Like data deleted successfully");
            }
            return updateLikeCountOfNews;
          } else {
            return false;
          }
        }
      } else {
        if (newsLikeCount && newsLikeCount.length > 0) {
          Count = parseInt(newsLikeCount[0].n_likeCount);
          // // // // // console.log(`Current news like count: ${Count}`);
          Count++;

          // // // // // console.log(`New news like count: ${Count}`);

          const updateLikeCountOfNews = await mongoHelper.updateData(
            { n_uuid: Id },
            "news",
            { n_likeCount: Count }
          );
          // // // // // console.log("updateLikeCountOfNews:", updateLikeCountOfNews);

          if (updateLikeCountOfNews) {
            const data = await mongoHelper.insert(
              { l_id: Id, l_us_id: userId, l_type: type },
              "like_data"
            );
            if (data) {
              // // // // // console.log("Like data inserted successfully");
            }
            return updateLikeCountOfNews;
          } else {
            return false;
          }
        }
      }
    }
  } catch (error) {
    // // // // // console.error("Error in like:", error);
    return false;
  }
};

module.exports = blogModel;
