const memberObj = require("../controller/member");

/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 */
const authObj = require(basePath + "/admin/application/controller/auth"),
  homeObj = require(basePath + "/admin/application/controller/home"),
  newsObj = require(basePath + "/admin/application/controller/news"),
  userObj = require(basePath + "/admin/application/controller/user"),
  blogObj = require(basePath + "/admin/application/controller/blog"),
  contactObj = require(basePath + "/admin/application/controller/contact"),
  resourceObj = require(basePath + "/admin/application/controller/resource"),
  eventObj = require(basePath + "/admin/application/controller/event");
module.exports = function () {
  //******************************  Authentication *******************************************//
  app.post("/admin/login", authObj.login);
  app.get("/admin", homeObj.adminLogin);
  app.get("/admin/dashboard", homeObj.index);
  app.get("/admin/changePassword", homeObj.changePasswordPage);
  app.get("/admin/reset-password", homeObj.resetpwdScreen);
  app.get("/admin/forgot-password", homeObj.forgetpasswordScreen);
  app.get("/admin/edit-profile", homeObj.editProfile);
  app.post("/register", authObj.register);
  app.post("/admin/edit-profile-data", authObj.adminEditProfile);
  app.post("/activate-account", authObj.activateAccount);
  app.post("/forget-password-email", authObj.userForgotPassword);
  app.post("/admin/reset-admin-password", authObj.userResetPassword);
  app.post("/admin/change-admin-password", authObj.adminChangePassword);
  app.post("/resend-activation-code", authObj.resendActivationCode);
  app.post("/admin/edit-upload-image", authObj.editUploadImage);
  app.post("/admin/send-inbox", authObj.sendInboxMessage);

  //******************************  Users *******************************************//
  app.get("/admin/create-user", homeObj.insertUserPage);
  app.get("/admin/users-list", homeObj.userListPage);
  app.post("/admin/insert-user", userObj.insertUser);
  app.post("/admin/user-list-ajax", userObj.userListAjax);
  app.post("/admin/delete-user", userObj.deleteUser);
  app.post("/admin/edit-users", userObj.editUser);
  app.post("/admin-logout", userObj.adminLogout);
  app.post("/admin/insert-about-content", userObj.insertAboutContent);

  //******************************  News *******************************************//
  app.post("/admin/upload-image", newsObj.uploadMultiple);
  app.post("/admin/insert-news", newsObj.insertNews);

  app.post("/admin/delete-news", newsObj.deleteNews);
  app.post("/admin/get-news-list-Ajax", newsObj.getNewslist);
  app.get("/admin/get-news-by-id/:id", newsObj.get_news_data_by_id);
  app.get("/admin/news", homeObj.news);
  app.get("/admin/manage-news-list", homeObj.managenewsListPage);

  //******************************  Blog *******************************************//
  app.post("/admin/insert-blog", blogObj.insertBlog);
  app.post("/admin/upload-blog-image", blogObj.uploadBlogImage);
  app.post("/admin/edit-blog", blogObj.editBlog);
  app.post("/admin/delete-blog", blogObj.deleteBlog);
  app.post("/admin/get-blog-list-Ajax", blogObj.getBloglist);
  app.get("/admin/get-blog-by-id/:id", blogObj.getBlogDataById);
  app.get("/admin/blog", homeObj.blog);
  app.get("/admin/manage-blog-list", homeObj.manageblogListPage);

  //******************************  Event *******************************************//
  app.post("/admin/insert-event", eventObj.insertEvent);
  app.post("/admin/upload-event-image", eventObj.uploadMultipleEventImage);
  app.post("/admin/upload-event-speakers-image", eventObj.uploadMultiplespeakerImage);
  app.post("/admin/edit-event", eventObj.editEvent);
  app.post("/admin/delete-event", eventObj.deleteEvent);
  app.post("/admin/get-event-list-Ajax", eventObj.getEventlist);
  app.get("/admin/get-event-by-id/:id", eventObj.getEventDataById);
  app.get("/admin/get-event-list", homeObj.manageeventListPage);
  app.get("/admin/event", homeObj.event);
  app.post("/admin/add-speaker", eventObj.addSpeaker);

  //****************************** Meber *******************************************//
  app.post("/admin/create-member", memberObj.createMember);
  app.post("/admin/create-member", memberObj.uploadProfileImage);
  app.post("/admin/edit-member", memberObj.editMember);
  app.post("/admin/delete-member", memberObj.deleteMember);
  app.post("/admin/get-member-list-Ajax/:loginRole", authObj.getMemberList);
  app.get("/admin/get-member-by-id/:id", memberObj.getmemberById);
  app.get("/admin/member", homeObj.member);
  app.get("/admin/get-member-list", homeObj.managememberListPage);
  app.post("/admin/activate-member", memberObj.activateMember);
  app.post("/admin/deactivate-member", memberObj.deactivateMember);

  //****************************** Payments management*******************************************//
  app.get("/admin/create-payement", homeObj.insertPaymentPage);
  app.post("/admin/insert-payment", userObj.insertPayments);
  app.post("/admin/insert-stripe", userObj.insertStripe);

  //****************************** Resources management*******************************************//
  app.post("/admin/insert-resource", resourceObj.insertResource);
  app.post("/admin/upload-resource-image", resourceObj.uploadResourceImage);
  app.post("/admin/upload-resource-pdf", resourceObj.uploadResourcePdf);
  app.get("/admin/resource", homeObj.resource);
  app.post("/admin/edit-resource", resourceObj.editResource);
  app.post("/admin/delete-resource", resourceObj.deleteResource);
  app.post("/admin/get-resource-list-Ajax", resourceObj.getResourcelist);
  app.get("/admin/get-resource-by-id/:id", resourceObj.getResourceDataById);
  app.get("/admin/manage-resource-list", homeObj.manageresourceListPage);

  //****************************** contact management*******************************************//
  app.post("/admin/insert-contact", contactObj.insertContact);
  app.get("/admin/create-contact", homeObj.insertContactPage);
  app.post("/admin/contact-list-ajax", contactObj.contactListAjax);
  app.get("/admin/contact-list", homeObj.contactListPage);
  app.post("/admin/delete-contact", contactObj.deleteContact);
  app.get("/admin/get_contact/:id", contactObj.get_contact);
  app.post("/admin/edit-jummah", contactObj.editContact);
};