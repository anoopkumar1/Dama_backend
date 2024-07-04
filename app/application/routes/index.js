/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 * Written By  : Anoop Kumar <anoop.zeroit@gmail.com>, june 2024
 * Description :
 * Modified By :
 */
const authObj = require("../controller/auth"),
  newsObj = require("../controller/news"),
  usersObj = require("../controller/user"),
  chatObj = require("../controller/chat"),
  middle = require("../routes/middleware");
const blogObj = require("../controller/blog");
const eventObj = require("../controller/event");
const resourceObj = require("../controller/resoure");
const searchObj = require("../controller/search");
module.exports = function () {
  app.all("/*", middle.allowHeaders);
  app.all("/private/*", middle.authenticate);
  //******************************Authentication*******************************************//
  app.post("/auth/register-email", authObj.registerWithEmail);
  app.post("/auth/verify-email", authObj.verifyEmail);
  app.post("/auth/forget-password-email", authObj.userForgotPasswordEmail);
  app.post("/auth/reset-password-email", authObj.resetPasswordEmail);
  app.post("/auth/verify-otp", authObj.activateAccount);
  app.post("/auth/resend-email-otp", authObj.resendEmailCode);
  app.post("/auth/login-with-email", authObj.loginWithEmail);
  /******/
  app.post("/private/update-profile-visibility", authObj.profileVisibility);
  app.post("/auth/add-personal-details", authObj.addPersonalDetails);
  app.post("/auth/add-change-profile-image", authObj.editUploadProfileImage);
  app.post("/private/add-change-cover-image", authObj.editUploadCoverImage);
  app.post("/private/edit-user-information", authObj.editUserInformation);
  app.post("/private/edit-user-bio", authObj.editBio);
  app.post("/get-privacy-policy-term-and-conditions", usersObj.getContent);
  app.post("/auth/save-linkedin-data", authObj.getUserLinkedinData);
  app.post("/private/get-about-content", usersObj.getAboutContent);
  app.post(
    "/private/upload-profile-image",
    authObj.editUploadProfileImageWithToken
  );
  /*******************************blog*********************************************/
  app.post("/private/post-comment", blogObj.postComment);
  app.post("/private/get-comment", blogObj.readComment);
  app.post("/private/get-blog-list", blogObj.getBlogList);
  app.post("/private/get-blog-detail", blogObj.getBlogDetails);
  app.post("/private/rate-article", blogObj.giverating);
  app.post("/private/like", blogObj.like);

  /***************************event************************************************* */
  app.post("/private/get-event-list", eventObj.getEventList);
  app.post("/private/get-event-detail", eventObj.geteventDetail);
  app.post("/private/book-event", eventObj.bookEvent);
  app.post("/private/upload-pdf", eventObj.uploadReciept);
  app.post("/private/get-my-event", eventObj.getMyEvents);
  app.post("/private/get-notification-list", eventObj.getNotificationList);
  app.post("/private/get-home-page-data", eventObj.getHomeData);

  //******************************News*******************************************//
  app.post("/private/get-all-news-list", newsObj.getAllNewsList);
  app.post("/private/get-news-detail", newsObj.getNewsDetail);

  //******************************Users*******************************************//
  app.post("/private/get-user-data", usersObj.getLoginUsersData);
  app.post("/private/get-other-user-data", usersObj.getOtherUserId);
  app.post(
    "/private/update-notification-setting",
    usersObj.updatenotificationSetting
  );

  //******************************Chat*******************************************//
  app.post("/private/upload-chat-image", chatObj.uploadChatImage);
  app.post("/private/upload-chat-video", chatObj.uploadChatVideo);
  app.post("/private/upload-chat-pdf", chatObj.uploadChatPdf);
  app.post("/private/upload-thumbnail", chatObj.uploadThumbnail);
  app.post("/private/upload-chat-doc", chatObj.uploadChatdoc);
  app.post("/private/chat-converstation-list", chatObj.chatList);
  app.post("/private/upload-audio", chatObj.uploadChatAudio);
  app.post("/private/add-user-converstation", chatObj.addUserConverstation);
  app.post("/private/get-message", chatObj.getMessage);
  app.post(
    "/private/conversation-search-history",
    chatObj.getconversationhistory
  );
  app.post("/private/get-all-user-chat-list", chatObj.getAllUserChatList);
  app.post("/private/update-seen-status", chatObj.updateSeenStatus);

  /************************resource***********************************/
  app.post("/private/get-resources-list", resourceObj.getAllResourceList);
  app.post("/private/get-resources-detail", resourceObj.getResourcesDetails);
  app.post("/private/purchase-resourse", resourceObj.purchaseResource);
  app.post("/private/get-my-resourse", resourceObj.getMyResources);
  app.post("/private/change-password", authObj.userChangePassword);
  app.post("/private/logout", authObj.logout);
  app.post("/private/delete-account", authObj.deleteAccount);

  /**********************************search********************************/
  app.post("/private/search-blog", searchObj.searchBlog);
  app.post("/private/search-news", searchObj.searchNews);
  app.post("/private/search-event", searchObj.searchEvents);
  app.post("/private/search-resource", searchObj.searchResources);
  app.post("/private/search-user", searchObj.searchUser);
};
