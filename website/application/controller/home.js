/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Diksha Jaswal <dikshaj.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */

const helper = require("../helpers/index"),
  homeModel = require("../model/home_model");
let homeObj = {};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
//------------------------------------------ Home Page API ----------------------------------------------------------------
homeObj.index = async function (req, res) {
  res.render("home_page", {});
};

/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
//------------------------------------------ Home Page API ----------------------------------------------------------------
homeObj.RegisterScreen = async function (req, res) {
  res.render("RegisterScreen", {});
};

//------------------------------------------ adminLogin Page API ----------------------------------------------------------------
homeObj.adminLogin = async function (req, res) {
  res.render("adminLogin", {});
};

//------------------------------------------ adminLogin Page API ----------------------------------------------------------------
homeObj.verifyEmail = async function (req, res) {
  res.render("verifyEmail", {});
};

//------------------------------------------ adminLogin Page API ----------------------------------------------------------------
homeObj.privacyPolicy = async function (req, res) {
  res.render("privacy", {});
};

homeObj.termsandcondition = async function (req, res) {
  res.render("terms&condition", {});
};

//------------------------------------------ edit Page API ----------------------------------------------------------------
homeObj.editprofile = async function (req, res) {
  res.render("editprofile", {});
};

//------------------------------------------ adminLogin Page API ----------------------------------------------------------------
homeObj.professionaldetail = async function (req, res) {
  res.render("professionaldetail", {});
};
homeObj.webevent = async function (req, res) {
  res.render("webevent", {});
};
homeObj.mainpage = async function (req, res) {
  res.render("main_page", {});
};
module.exports = homeObj;
