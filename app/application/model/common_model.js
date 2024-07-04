/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 *
 * Description :
 * Modified By :
 */

const newModelObj = {},
  q = require("q"),
  fcm = require("fcm-node"),
  mongoHelper = require("../helpers/mongo_helper"),
  firebaseConfig = {
    type: "service_account",
    project_id: "ubermaa-85d10",
    private_key_id: "f60129aa929dc22bc4227b190290098a50afe17a",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCKaHeIzYyv6IBD\n/K68b4QjeSfKjuDhp6R6zcjx5/wqM+Ij/o0eVzng3MnlsOSq+JM+v2IY1sFyHb+a\nZX0SlttEQZrOwLQqsHJ0EwkqSDku/lLkRdUI9N5aTi7q+1yawYvsmkMp2tKiULa6\nofHvbOoEvBaSGR9cb/vT4CvZ7RjwUrLKQMjYF3gVsWjiChnghs67Jxxt1xJtP3wA\nzF4UQYM7FQoZEJZreg6twpDMbqKNM4UcLnHARkr0kPFsxuiy+oIQHZt2fxnW/m3F\nwxWu1sWdLyIJZFv54wvHnIwHuFLQypYS2l32ooYzJb+sck7PmiJhLYFTq3iQz6F+\n1Tp3VnWTAgMBAAECggEAQevLsv6jmUzVeowo9Vrvxq13xEQU26Uq88p7gKwLMFaR\nyK7+q4rD6FOAXcPIxZ2rE+G3aTkv3ZhJn9Hipi3vtSzB/ONPbF2pxZsjbF4FzloX\nRN31v1RRaxV9xzF9Q8AXUtOOVasBU4m53l4viueG9kZXQbJxe2diu+EzQZJppFwr\nqr0m5SQUSFoTpd/HsE8w1n+bt2U0AA1VBR0ty+RjaV5C5O4J8Kwa0Z9F0D0bbOND\nYtCZxWb4gcukb9iRwJp76vJ983mC5pvwOyZ+iO9r6ep/BRyRXQZ4cucpfRVcTxtH\nIl4NMqPoxQG4kJ6sYdyj61SkIt1IAqfW2hkkSR4eYQKBgQDA8T4q50FHJsMPDHn6\nCltnxbaIAXAe9E46/Uvx5IYr6pr/5boph9Wz5S2dJ2UMzEEa03o2cjAJWWi7lUqe\n+9EDrimwsP6fS1LtWmky6IFiuEdx9vGfPKEVZUWRnWhrh9dR4DybGUeZ2tYCTSah\nkHeilOcACgWaZl9Dxfl4J8DsSQKBgQC3pIwLHbT/FNXP60j9FABRms9jAnsqFXKp\n/RHxDrpH1P+XDxAqI9ezKiENskzB8XHUo8XkjNJqJdNwMOfk7SzFHdg4vBdM3M7k\nZwf9H1o327+0zJ/blH9x3squVi3GJbQty1V6KU7SniJ0cTKKDtpHcBYnVpg2pL16\n63Yfn/R6+wKBgQC6i4TT7mtK48tMTX/RpRnjJ2Hn9Zv2EbdhiW1YHt8qrtXV/MMV\nTGPuXvLPMzucOA/qY/WRlq2jHHMKirlvJYFc0ZM1ZquIUEeJfRShR/NxA0LwiRXs\nI66LBTNSKqK+9MPWQbvXKYX014R7DSUAqLFC3DzL6OSp97i7yjn9VlJNIQKBgQCN\nrlOlV9wGWIrFCN+c8Ut1qhyKZKWlSDrYzziCZDxvovM2FhcAi/qkbcJmkMMLdj2+\nMkRBGixUXK6OBg1C34EE6wugae0IDetI5/yP2xp9sfprgNtsS1sv/RUd/7r8/qXO\nFuvxfeEkOYCXmaXGQcNCDkXpP7PbpKnTJcpSh9PU9QKBgDCzWC1m6HM6ratvia/q\npBVx48Lo78aDohvO+CH5C417UXx5deAtTS0lHnIX0Iw+4xbVXZ/RprKGfkOuWXHR\nPUzcrWvBSyonIyz0+UOKGnc7BkEXWuj2ovqFe693XI5JUsOrusHcwN19OIsrMvBs\nUgZL2uzXvIlnO+uid/tDwBvn\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-86u90@ubermaa-85d10.iam.gserviceaccount.com",
    client_id: "103115187387906002474",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-86u90%40ubermaa-85d10.iam.gserviceaccount.com",
  };
const FCM = new fcm(firebaseConfig);

/**
 * Function     : sendNotificationUser
 * Description  : Common function for using send notification to user.
 * Developed By :
 * Modified By  :
 */
newModelObj.sendNotificationFCM = async function (nMessageObj, receiverId) {
  // console.log("nMessageObj:", nMessageObj);
  FCM.send(nMessageObj, function (err, response) {
    if (err) {
      // console.log("notification not sent");
      return false;
    } else {
      // console.log("notification  sent succesfully");

      return true;
    }
  });
};

/**
 * Function     : socketNotification
 * Description  :
 * Developed By :
 * Modified By  :
 */
newModelObj.socketNotification = async function (userId) {
  let toSocketId = await newModelObj.getUserSocketId(userId);

  if (toSocketId.length > 0) {
    let sendObj = {
      action: "NEW ORDER",
    };

    toSocketId.forEach(function (row) {
      io.to(row.uc_socket_id).emit("call", sendObj);
    });
  }
};
/**
 * This function is using to get user meeting
 * @param     :
 * @returns   :
 * @developer :
 */
newModelObj.getUserSocketId = async function (userId) {
  let deferred = q.defer();

  if (userId && userId != "") {
    let selectObj = {
      uc_fk_uc_uuid: userId,
    };
    let getData = await mongoHelper.getData(selectObj, "users_connections");

    if (getData) {
      deferred.resolve(getData);
    } else {
      deferred.resolve([]);
    }
  }

  return deferred.promise;
};

/**
 * Function     : socketNotificationNewOffer  new driver offer
 * Description  :
 * Developed By : Sangeeta
 * Modified By  :
 */
newModelObj.socketNotificationNewOffer = async function (userId) {
  let toSocketId = await newModelObj.getUserSocketId(userId);
  if (toSocketId.length > 0) {
    let sendObj = {
      action: "NEW-DRIVER-OFFER",
    };

    toSocketId.forEach(function (row) {
      io.to(row.uc_socket_id).emit("call", sendObj);
    });
  }
};
/**
 * Function     : socketNotificationNewOffer  new driver offer
 * Description  :
 * Developed By :
 * Modified By  :
 */
newModelObj.acceptOfferSockets = async function (userId, action) {
  let toSocketId = await newModelObj.getUserSocketId(userId);

  if (toSocketId.length > 0) {
    let sendObj = {
      action: action,
    };

    toSocketId.forEach(function (row) {
      io.to(row.uc_socket_id).emit("call", sendObj);
    });
  }
};
/**
 * Function     : socketNotificationNewOffer  new driver offer
 * Description  :
 * Developed By :
 * Modified By  :
 */
newModelObj.sendChatCount = async function (userId, chatCount) {
  let toSocketId = await newModelObj.getUserSocketId(userId);

  if (toSocketId.length > 0) {
    let sendObj = {
      action: "CHAT-COUNT",
      data: {
        chatCount: chatCount,
      },
    };

    toSocketId.forEach(function (row) {
      io.to(row.uc_socket_id).emit("call", sendObj);
    });
  }
};

/**
 * Send email function
 * @param     :
 * @returns   :
 * @developer :
 */
newModelObj.generalMail = async function (emailData) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mailto:anoop.zeroit@gmail.com",
      pass: "iqovtxtfnzahbzwf",
    },
  });

  let mailOptions = {
    from: emailData.from, // sender address
    to: emailData.to, // list of receivers
    subject: emailData.subject, // Subject line
    html: emailData.body, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    }

    return true;
  });

  const FCM = new fcm(firebaseConfig);

  /**
   * Function     : sendNotificationUser
   * Description  : Common function for using send notification to user.
   * Developed By :
   * Modified By  :
   */
  newModelObj.sendNotificationFCM = async function (nMessageObj, receiverId) {
    FCM.send(nMessageObj, function (err, response) {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  };
};
module.exports = newModelObj;
