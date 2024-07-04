const q = require("q");
let constants = {};

constants.getConstant = async function () {
  let deferred = q.defer(),
    obj = {};

  obj.UBER_USER_UUID = "09d36bc0-54353-4840-a247-df7a0df6e85c";
  obj.AWS_BUCKET_NAME = "allora-bucket";
  obj.AWS_ACCESS_KEY = "AKIAYEERXMTXAORDZE6S";
  obj.AWS_SECRET_ACCESS_KEY = "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";
  obj.PROFILE_IMAGE_PATH = "users-profile-images/";
  obj.REFER_AMT = 30;
  (obj.TWILIO_SID = "AC6b365d41778de7e7b178b3c00a77d83d"),
    (obj.TWILIO_PHONE_NUMBER = "+13137518392");
  (obj.TWILIO_TOKEN = "e61e0bc39a604e830b785e050f3f5de2"),
    (obj.TWILIO_SERVICE_ID = "VAc792a26db8e5eed6dff7618395d0040a"),
    (obj.UPLOAD_PROOF_PATH = "images/");
  obj.CHAT_MEDIA_FOLDER = "chat-media/";
  (obj.AWS_VIDEO_URL = "https://allora-bucket.s3.eu-north-1.amazonaws.com/"),
    (obj.AWS_VIDEO_UPLOAD_URL =
      "https://allora-bucket.s3.eu-north-1.amazonaws.com/"),
    (obj.AWS_VIDEO_FOLDER = "chat-media/"),
    (obj.AWS_THUMBNAIL_FOLDER = "thumbnail/"),
    (obj.baseUrl = "http://52.55.77.120");
  deferred.resolve(obj);
  return deferred.promise;
};
// constants.getConstant = async function () {
//   let deferred = q.defer(),
//     obj = {};
//   obj.UBER_USER_UUID = "09d36bc0-54353-4840-a247-df7a0df6e85c";
//   obj.AWS_BUCKET_NAME = "stealar-bucket";
//   obj.AWS_ACCESS_KEY = "AKIAQ3EGQHMLHXVSRTJS";
//   obj.AWS_SECRET_ACCESS_KEY = "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";
//   obj.RESTAURANT_IMAGE_PATH = "restaurant-images/";
//   obj.REFER_AMT = 30;
//   obj.UPLOAD_PATH = "images/";
//   obj.CHAT_MEDIA_FOLDER = "chat-media/";
//   (obj.AWS_VIDEO_URL = "https://allora-bucket.s3.eu-north-1.amazonaws.com/"),
//     (obj.AWS_VIDEO_UPLOAD_URL =
//       "https://allora-bucket.s3.eu-north-1.amazonaws.com/"),
//     (obj.AWS_VIDEO_FOLDER = "chat-media/"),
//     (obj.AWS_THUMBNAIL_FOLDER = "thumbnail/"),
//     deferred.resolve(obj);
//   return deferred.promise;
// };
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = constants;
}
