/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 *
 *
 * Written By  : Diksha Jaswal <dikshaj.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */

//  const userObj = require("../controller/auth");
const homeObj = require(basePath + "/website/application/controller/home");

module.exports = function () {
  //Home Page API --------------------------------
  app.get("/", homeObj.index);
  app.get("/admin", homeObj.adminLogin);
  app.get("/register", homeObj.RegisterScreen);
  app.get("/verify", homeObj.verifyEmail);
  app.get("/privacy", homeObj.privacyPolicy);
  app.get("/terms&condition", homeObj.termsandcondition);
  app.get("/profile", homeObj.editprofile);
  app.get("/professional", homeObj.professionaldetail);
  app.get("/main", homeObj.mainpage);
};
