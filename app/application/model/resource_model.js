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
const eventModel = require("./event_model");
const resourceModel = {};

/**
 * for get  resource list
 * @param    :
 * @developer    : Manjeet Thakur
 */
resourceModel.getAllResourceList = async (body) => {
  try {
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    let searchObj = {
      r_deleted: "0",
    };

    let getData = await mongoHelper.getpaginatedData(searchObj, "resource", {
      skip,
      limit,
    });

    if (getData && getData.length > 0) {
      const totalResources = await mongoHelper.countData(searchObj, "resource");

      const totalPages = Math.ceil(totalResources / pageSize);
      getData.sort((a, b) => new Date(b.r_created) - new Date(a.r_created));
      return {
        data: getData,
        currentPage: page,
        totalPages: totalPages,
        totalResources: totalResources,
      };
    } else {
      return { error: "No resources found", code: 200 };
    }
  } catch (error) {
    // console.error("Error in getAllResourceList:", error);
    return { error: "Internal server error", code: 200 };
  }
};

/**
 * for get resourceDetail
 * @param   :
 * @developer    : Manjeet Thakur
 */

/**
 * for purchase resources
 * @param    :
 * @developer   : Manjeet Thakur
 */

resourceModel.purchaseresource = async (body, userId) => {
  try {
    // console.log("userId", userId);
    if (body || body.resourceId) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      let resource = await mongoHelper.getData(
        { r_uuid: body.resourceId },
        "resource"
      );
      if (resource) {
        // console.log(userId, "userId");
        const [userData, userDeviceData] = await Promise.all([
          mongoHelper.getData({ uc_uuid: userId }, "users_credential"),
          mongoHelper.getData({ ud_fk_uc_uuid: userId }, "users_devices"),
        ]);

        if (userData) {
          const insertObj = {
            r_id: body.resourceId,
            r_uc_uuid: userId,
            r_purchase_date: formattedDate,
            r_amount: body.amount,
            r_type: body.type,
          };

          const insertData = await mongoHelper.insert(
            insertObj,
            "resource_purchase_detail"
          );
          // console.log(insertData, "insertData");
          const token = userDeviceData[0].ud_token;
          if (token) {
            // console.log("useData", userData);
            const notificationSetting = userData[0].uc_notificationSetting;
            const array = [userDeviceData[0].ud_token];

            const messageObj = {
              notification: {
                title: "Successful Purchase",
                body: "You purchased a resource successfully",
                sound: "notification.wav",
                badge: "1",
                priority: "high",
                android_channel_id: "high_importance_channel",
              },
              data: {
                title: "Successful Purchase",
                score: "850",
                click_action: "FLUTTER_NOTIFICATION_CLICK",
              },
              registration_ids: array,
            };

            if (notificationSetting === "1") {
              await newModelObj.sendNotificationFCM(
                messageObj,
                userData[0].uc_uuid
              );
            } else {
              // console.log("Notification blocked by user");
            }

            // console.log("Function executed successfully");

            const paymentReceipt = {
              receiptTitle: "Payment Receipt",
              payerName: `${userData[0].uc_first_name} ${userData[0].uc_last_name}`,
              paymentDate: formattedDate,
              receiptNumber: Math.floor(Math.random() * 1000),
              amountPaid: body.amount,
              resourceName: resource[0].r_title,
              description: "Payment for resource purchasing",
            };

            if (body.type === "PAID") {
              const htmlContent = `
                    <table border="1" cellpadding="5" cellspacing="0">
                      <tr>
                        <th>Receipt Title</th>
                        <td>${paymentReceipt.receiptTitle}</td>
                      </tr>
                      <tr>
                        <th>Payer Name</th>
                        <td>${paymentReceipt.payerName}</td>
                      </tr>
                      <tr>
                        <th>Payment Date</th>
                        <td>${paymentReceipt.paymentDate}</td>
                      </tr>
                      <tr>
                        <th>Receipt Number</th>
                        <td>${paymentReceipt.receiptNumber}</td>
                      </tr>
                      <tr>
                        <th>Amount Paid</th>
                        <td>$${paymentReceipt.amountPaid}</td>
                      </tr>
                      <tr>
                        <th>Resource Name</th>
                        <td>${paymentReceipt.resourceName}</td>
                      </tr>
                      <tr>
                        <th>Description</th>
                        <td>${paymentReceipt.description}</td>
                      </tr>
                    </table>
                  `;

              await eventModel.sendRecieptEmail(
                userData[0].uc_email,
                htmlContent
              );
            }

            const eid = v4();
            const insertNotificationObj = {
              uuid: eid,
              userId: userId,
              resourceId: body.resourceId,
              title: "Successful Purchasing",
              body: "You purchased a resource successfully",
              date: new Date(),
              status: true,
              receipt: paymentReceipt,
            };

            // console.log("insertNotificationObj:", insertNotificationObj);

            const insertNotificationData = await mongoHelper.insert(
              insertNotificationObj,
              "notifications"
            );

            if (insertNotificationData) {
              // console.log("Data inserted successfully", insertNotificationData);
              return true;
            } else {
              // console.log("Failed to insert notification data");
              return false;
            }
          } else {
            // console.log("Device token is not provided");
            return false;
          }
        } else {
          // console.log("User data, device data,");
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.error("Error in purchaseresource:", error);
    return false;
  }
};
/**
 * for sendMail of reciept
 * @param    :
 * @developer    : Manjeet Thakur
 */
resourceModel.sendRecieptEmail = async function (email, fileName) {
  let deferred = q.defer();

  let emailArray = {
    to: email,
    from: "Community App <mailto:anoop.zeroit@gmail.com>",
    subject: "Payment Reciept",
    body: "Welcome to Dama App.Your payment reciept is  " + fileName + ".",
  };

  eventModel.generalMail(emailArray);

  deferred.resolve(true);

  return deferred.promise;
};

/**
 * for send mail
 */
resourceModel.generalMail = async function (emailData) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mailto:anoop.zeroit@gmail.com",
      pass: "bwei ygtd gtzm pezx",
    },
  });

  let mailOptions = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.body,
  };

  return new Promise((resolve, reject) => {
    let mail = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
    // console.log(mail, "mailmail");
  });
};
/**
 * for get resource detailsById
 * @param    :
 * @developer   :  anoop Thakur
 */

resourceModel.getResourcesDetails = async (resourceId, userId) => {
  try {
    if (!resourceId) return null;

    let searchObj = { r_uuid: resourceId };
    let resourceDetailsArray = await mongoHelper.getData(searchObj, "resource");
    // console.log(resourceDetailsArray);

    if (resourceDetailsArray.length === 0) return null;

    let anothersearchObj = {
      r_id: resourceDetailsArray[0].r_uuid,
      r_uc_uuid: userId,
    };

    let searchObj2 = {
      _ruuid: resourceId,
      _uuid: userId,
    };

    // console.log(searchObj2, "searchObj2");
    // console.log(anothersearchObj);

    let [purchaseData, rateData] = await Promise.all([
      mongoHelper.getData(anothersearchObj, "resource_purchase_detail"),
      mongoHelper.getData(searchObj2, "rating"),
    ]);

    // console.log("purchase data", purchaseData);

    if (purchaseData && purchaseData.length > 0) {
      resourceDetailsArray[0].r_purchase = 1;
    } else {
      resourceDetailsArray[0].r_purchase = 0;
    }

    if (rateData && rateData.length > 0) {
      resourceDetailsArray[0].r_rateByMe = 1;
    } else {
      resourceDetailsArray[0].r_rateByMe = 0;
    }

    return resourceDetailsArray[0];
  } catch (error) {
    // console.error(error);
    return null;
  }
};

/**
 * for get my resources
 * @param     :
 * @developer   : Manjeet thakur
 */

resourceModel.getMyResource = async (body, userId) => {
  try {
    if (!userId) {
      // console.log("User ID not provided");
      return { error: "User ID not provided", code: 400 };
    }

    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 400 };
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchCriteria = { r_uc_uuid: userId };

    // console.log(`Fetching resource bookings for user ID: ${userId}`);
    const getResourceBookings = await mongoHelper.getpaginatedData(
      searchCriteria,
      "resource_purchase_detail",
      { skip, limit }
    );

    if (!getResourceBookings || getResourceBookings.length === 0) {
      // console.log("No resources found for the user");
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
      };
    }

    // console.log(
    //   `Found ${getResourceBookings.length} resource bookings for user ID: ${userId}`
    // );
    const resourceList = [];

    for (const resourceBooking of getResourceBookings) {
      const resourceId = resourceBooking.r_id;

      // console.log(`Fetching resource details for resource ID: ${resourceId}`);
      const getResourceDetails = await mongoHelper.getData(
        { r_uuid: resourceId },
        "resource"
      );

      if (getResourceDetails && getResourceDetails.length > 0) {
        // console.log(`Resource details found for resource ID: ${resourceId}`);
        resourceList.push(getResourceDetails[0]);
      } else {
        // console.log(`Resource with ID ${resourceId} not found or empty`);
      }
    }

    const totalResources = await mongoHelper.countData(
      searchCriteria,
      "resource_booking"
    );
    const totalPages = Math.ceil(totalResources / pageSize);

    // // console.log(
    //   `Returning ${resourceList.length} resources for user ID: ${userId}`
    // );
    return {
      data: resourceList,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalResources,
    };
  } catch (error) {
    // console.error("Error in getMyResources:", error);
    return { error: "An error occurred", code: 500 };
  }
};

module.exports = resourceModel;
