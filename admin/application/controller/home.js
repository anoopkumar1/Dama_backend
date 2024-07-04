/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : anoop Kumar <anoop.zeroit@gmail.com>, May 2024
 * Description :
 * Modified By :
 */
const q = require("q"),
  passwordHash = require("password-hash"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  constants = require("../../../common/config/constants"),
  mongoHelper = require("../helpers/mongo_helper");
nodeMailer = require("nodemailer");
let homeObj = {};

/**
 * This function is using to get the total users,event,blogs,event in dashboard
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.index = async function (req, res) {
  let userObj = {
    uc_active: "1",
  },
    userData = await mongoHelper.getData(userObj, "users_credential");

  let newsObj = {
    n_deleted: "0",
  },
    totalnews = await mongoHelper.getData(newsObj, "news");
    
  let blogObj = {
    b_deleted: "0",
  },
    blogData = await mongoHelper.getData(blogObj, "blog");


    let resourceObj = {
      r_deleted: "0",
    },
      resourceData = await mongoHelper.getData(resourceObj, "resource");
  

  let eventObj = {
    e_deleted: "0",
  },
    eventData = await mongoHelper.getData(eventObj, "event");



    let resourcepurchaseObj = {
      r_type: "PAID",
    },
    resourcepurchaseData = await mongoHelper.getData(resourcepurchaseObj, "resource_purchase_detail");



  res.render("dashboard", {
    data: {
      totalUsers: userData.length,
      totalnews: totalnews.length,
      blogData: blogData.length,
      eventData: eventData.length,
      resourceData: resourceData.length,
      resourcepurchaseData: resourcepurchaseData.length,    
    },
  });
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.managenewsListPage = async function (req, res) {
  res.render("managenewsList", {});
};

homeObj.news = async function (req, res) {
  res.render("news", {});
};

/**
 * This function is using to Blog Page list
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */

homeObj.manageblogListPage = async function (req, res) {
  res.render("blogList", {});
};


/**
 * This function is using to Blog Page list
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */

homeObj.manageresourceListPage = async function (req, res) {
  res.render("resourceList", {});
};

homeObj.blog = async function (req, res) {
  res.render("blog", {});
};
/**
 * This function is using to render  Event Page list
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
homeObj.manageeventListPage = async function (req, res) {
  res.render("eventList", {});
};

homeObj.event = async function (req, res) {
  res.render("event", {});
};

homeObj.resource = async function (req, res) {
  res.render("resource", {});
};

/**
 * This function is using to render  member Page list
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
homeObj.managememberListPage = async function (req, res) {
  res.render("managememberList", {});
};

homeObj.member = async function (req, res) {
  res.render("member", {});
};

/**
 * This function is using to render adminLogin
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.adminLogin = async function (req, res) {
  res.render("adminLogin", {});
};

/**
 * This function is using to render passwordForget
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.passwordForget = async function (req, res) {
  res.render("passwordForget", {});
};

/**
 * This function is using to render resetPassword
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.resetPassword = async function (req, res) {
  res.render("resetPassword", {});
};

/**
 * This function is using to render userPage
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.insertUserPage = async function (req, res) {
  res.render("insertUser", {});
};


/**
 * This function is using to render userPage
 * @param     :
 * @returns   :
 * @developer : Anoop
 */
homeObj.insertPaymentPage = async function (req, res) {
  res.render("insertPayment", {});
};

/**
 * This function is using to get userListPage
 * @param     :
 * @returns   :
 * @developer :Anoop
 */
homeObj.userListPage = async function (req, res) {
  res.render("userList", {});
};

/**
 * This function is using to changepasswordScreen
 * @param     :
 * @returns   :
 * @developer :Anoop
 */
homeObj.changePasswordPage = async function (req, res) {
  res.render("changePassword", {});
};

/**
 * This function is using to resetpwdScreen
 * @param     :
 * @returns   :
 * @developer :Anoop
 */
homeObj.resetpwdScreen = async function (req, res) {
  res.render("resetpwdScreen", {});
};

/**
 * This function is using to forgetpasswordScreen
 * @param     :
 * @returns   :
 * @developer :Anoop
 */
homeObj.forgetpasswordScreen = async function (req, res) {
  res.render("forgetpasswordScreen", {});
};

/**
 * This function is using to editProfile admin
 * @param     :
 * @returns   :
 * @developer :Anoop
 */
homeObj.editProfile = async function (req, res) {
  res.render("editProfile", {});
};

/**
 * This function is using to render verificationScreen
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.verificationScreen = async function (req, res) {
  res.render("verificationScreen", {});
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.insertContactPage = async function (req, res) {
  res.render("insertContact", {});
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
homeObj.contactListPage = async function (req, res) {
  res.render("contactList", {});
};

module.exports = homeObj;
