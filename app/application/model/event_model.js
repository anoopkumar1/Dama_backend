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
const PDFDocument = require("pdfkit");
const fs = require("fs");
const e = require("express");
const mongoHelper = require("../helpers/mongo_helper");
const helper = require("../helpers");
const newModelObj = require("./common_model"),
  { v4 } = require("uuid");
const busboy = require("busboy");
const q = require("q");

let eventModel = {};

/**
 * for get event list
 * @param   :
 * @developer   : Manjeet Thakur
 */

eventModel.getEventLists = async (body, userId) => {
  try {
    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);
    if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
      return { error: "Invalid page or pageSize", code: 200 };
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const searchObj = {
      e_deleted: "0",
    };

    const totalEvents = await mongoHelper.countData(searchObj, "event");
    if (totalEvents === false) {
      return { error: "Error fetching total count", code: 200 };
    }

    const result = await mongoHelper.getpaginatedData(searchObj, "event", {
      skip,
      limit,
    });
    if (result === false) {
      return { error: "Error fetching data", code: 200 };
    }

    const totalPages = Math.ceil(totalEvents / pageSize);
    result.sort((a, b) => new Date(b.e_created) - new Date(a.e_created));

    return {
      data: result,
      currentPage: page,
      totalPages: totalPages,
      totalEvents: totalEvents,
    };
  } catch (error) {
    // console.log(error);
    return { error: "Internal server error", code: 20 };
  }
};

/**
 * for get event detailsById
 * @param    :
 * @developer   :  Manjeet Thakur
 */

eventModel.getEventDetail = async (eventId, userId) => {
  try {
    if (!eventId) {
      // console.log("Event ID not provided");
      return false;
    }

    const searchEventObj = { e_uuid: eventId };
    const searchSpeakerObj = { e_s_uuid: eventId };

    const [eventDetails, eventSpeakerDetails] = await Promise.all([
      mongoHelper.getData(searchEventObj, "event"),
      mongoHelper.getData(searchSpeakerObj, "event_speaker"),
    ]);

    if (eventDetails && eventDetails.length > 0) {
      const eventDetail = eventDetails[0];

      if (eventSpeakerDetails && eventSpeakerDetails.length > 0) {
        eventDetail.e_speakers = eventSpeakerDetails.map((speaker) => ({
          name: speaker.e_s_name,
          image: speaker.e_s_speakerImage[0],
        }));
      }

      const anotherSearchEventObj = {
        e_id: eventDetail.e_uuid,
        e_uc_id: userId,
      };

      // console.log("Another search object:", anotherSearchEventObj);

      const getData = await mongoHelper.getData(
        anotherSearchEventObj,
        "event_booking"
      );
      // console.log("getData:", getData);

      eventDetail.e_attend = getData && getData.length > 0 ? 1 : 0;

      return eventDetail;
    } else {
      // console.log("Event details not found");
      return false;
    }
  } catch (error) {
    // console.error("Error fetching event details:", error);
    return false;
  }
};

/**
 * for book event
 * @param   :
 * @developer  : Manjeet Thakur
 */

eventModel.bookEvent = async (userId, body, req) => {
  try {
    let currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    let data1 = await mongoHelper.getData({ e_uuid: body.eventId }, "event");

    if (userId && data1 && data1.length > 0) {
      let insertObj = {
        e_uc_id: userId,
        e_id: body.eventId,
        e_type: body.type,
        e_status: "1",
      };

      let result = await mongoHelper.insert(insertObj, "event_booking");

      if (result) {
        const [data, userTokenData] = await Promise.all([
          mongoHelper.getData({ uc_uuid: userId }, "users_credential"),
          mongoHelper.getData({ ud_fk_uc_uuid: userId }, "users_devices"),
        ]);

        // console.log("data:", data);
        // console.log("userTokenData:", userTokenData);

        if (
          data &&
          userTokenData &&
          data.length > 0 &&
          userTokenData.length > 0
        ) {
          // console.log("data[0].uc_device_token", userTokenData[0].ud_token);

          if (userTokenData[0].ud_token) {
            let array = [userTokenData[0].ud_token];

            let messageObj = {
              notification: {
                title: "Successful Booking",
                body: "Your Booking is Successful",
                sound: "notification.wav",
                badge: "1",
                priority: "high",
                android_channel_id: "high_importance_channel",
              },
              data: {
                title: "Successful Booking",
                score: "850",
                click_action: "FLUTTER_NOTIFICATION_CLICK",
              },
              registration_ids: array,
            };

            if (data[0].uc_notificationSetting == "1") {
              await newModelObj.sendNotificationFCM(
                messageObj,
                data[0].uc_uuid
              );
            } else {
              // console.log("Notification blocked by user");
            }

            // console.log("Function executed successfully");
            let insertNotificationObj;
            const paymentReceipt = {
              receiptTitle: "Payment Receipt",
              payerName: data[0].uc_first_name + " " + data[0].uc_last_name,
              paymentDate: formattedDate,
              receiptNumber: Math.floor(Math.random() * 1000),
              amountPaid: body.amount,
              eventName: data1[0].e_title,
              description: "Payment for event booking",
            };

            if (body.type == "PAID") {
              let eid = v4();
              // console.log("error");

              const paymentReceipt = {
                receiptTitle: "Payment Receipt",
                payerName: data[0].uc_first_name + " " + data[0].uc_last_name,
                paymentDate: formattedDate,
                receiptNumber: Math.floor(Math.random() * 1000),
                amountPaid: body.amount,
                eventName: data1[0].e_title,
                description: "Payment for event booking",
              };

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
                    <th>Event Name</th>
                    <td>${paymentReceipt.eventName}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>${paymentReceipt.description}</td>
                  </tr>
                </table>
              `;

              await eventModel.sendRecieptEmail(data[0].uc_email, htmlContent);
            }

            let eid = v4();
            insertNotificationObj = {
              uuid: eid,
              userId: userId,
              eventId: body.eventId,
            };

            // console.log("insertNotificationObj:", insertNotificationObj);

            let insertNotificationData = await mongoHelper.insert(
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
          // console.log("User or token data does not exist or is empty");
          return false;
        }
      } else {
        // console.log("Failed to insert into event_booking");
        return false;
      }
    } else {
      // console.log("User ID not provided");
      return false;
    }
  } catch (error) {
    // console.error("Error in bookEvent:", error);
    return false;
  }
};

/**
 * for get my events
 * @param    :
 * @developer   : Manjeet Thakur
 */
eventModel.getMyEvent = async (userId, body) => {
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

    const searchObj = { e_uc_id: userId };

    // console.log(`Fetching event bookings for user ID: ${userId}`);
    const getevent = await mongoHelper.getpaginatedData(
      searchObj,
      "event_booking",
      { skip, limit }
    );

    if (!getevent || getevent.length === 0) {
      // console.log("No events found for the user");
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
      };
    }

    // // console.log(
    //   `Found ${getevent.length} event bookings for user ID: ${userId}`
    // );
    const eventList = [];

    for (const eventBooking of getevent) {
      const eventId = eventBooking.e_id;

      // console.log(`Fetching event details for event ID: ${eventId}`);
      const getEventList = await mongoHelper.getData(
        { e_uuid: eventId },
        "event"
      );

      if (getEventList && getEventList.length > 0) {
        // console.log(`Event details found for event ID: ${eventId}`);
        eventList.push(getEventList[0]);
      } else {
        // console.log(`Event with ID ${eventId} not found or empty`);
      }
    }

    const totalEvents = await mongoHelper.countData(searchObj, "event_booking");
    const totalPages = Math.ceil(totalEvents / pageSize);

    // console.log(`Returning ${eventList.length} events for user ID: ${userId}`);
    return {
      data: eventList,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalEvents,
    };
  } catch (error) {
    // console.error("Error in getMyEvents:", error);
    return { error: "An error occurred", code: 500 };
  }
};

/**
 * for get notification list
 * @param     :
 * @developer   : Manjeet Thakur
 */
eventModel.getNotificationList = async (userId, body) => {
  try {
    if (userId) {
      const page = parseInt(body.page);
      const pageSize = parseInt(body.pageSize);
      if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
        return { error: "Invalid page or pageSize", code: 200 };
      }

      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      let searchObj = {
        userId: userId,
      };
      let getNotification = await mongoHelper.getpaginatedData(
        searchObj,
        "notifications",
        {
          skip,
          limit,
        }
      );
      if (getNotification) {
        const totalNotification = await mongoHelper.countData(
          searchObj,
          "notifications"
        );

        const totalPages = Math.ceil(totalNotification / pageSize);
        getNotification.sort((a, b) => b - a);
        return {
          data: getNotification,
          currentPage: page,
          totalPages: totalPages,
          totalNotification: totalNotification,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

/**
 * This is used to get home page data
 * @param     :
 * @returns   :
 * @developer :Manjeet  thakur
 */

eventModel.getHomeData = async function (body, userId) {
  try {
    // console.log("Received body:", body);
    // console.log("Received userId:", userId);

    const page = parseInt(body.page);
    const pageSize = parseInt(body.pageSize);

    // console.log("Parsed page:", page);
    // console.log("Parsed pageSize:", pageSize);

    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
      // console.log("Invalid page or pageSize");
      return { error: "Invalid page or pageSize", code: 200 };
    }

    let obj1 = { n_deleted: "0" };
    let obj2 = { b_deleted: "0" };

    let [news, blog] = await Promise.all([
      mongoHelper.getData(obj1, "news"),
      mongoHelper.getData(obj2, "blog"),
    ]);

    // console.log("Fetched news:", news);
    // console.log("Fetched blog:", blog);

    let adminIds = new Set([
      ...news.map((item) => item.n_adminId),
      ...blog.map((item) => item.b_adminId),
    ]);

    // console.log("Admin IDs:", adminIds);

    let adminUsersData = await mongoHelper.getData(
      { au_uuid: { $in: Array.from(adminIds) } },
      "admin_users"
    );

    // console.log("Admin users data:", adminUsersData);

    let adminUsersMap = {};
    adminUsersData.forEach((adminUser) => {
      adminUsersMap[adminUser.au_uuid] = {
        name: adminUser.au_firstname + " " + adminUser.au_lastname,
        role: adminUser.au_role,
        image: adminUser.au_profileImage,
      };
    });

    // console.log("Admin users map:", adminUsersMap);

    for (const n of news) {
      let searchObj = {
        l_id: n.n_uuid,
        l_us_id: userId,
      };
      // console.log(searchObj, "searchobj,.......................");
      let getData = await mongoHelper.getData(searchObj, "like_data");
      // console.log("getdata", getData);

      n.n_likedByMe = getData && getData.length > 0 ? 1 : 0;
    }

    for (const b of blog) {
      let searchObj = {
        l_id: b.b_uuid,
        l_us_id: userId,
      };
      // console.log(searchObj, "searchobj,.......................");

      let getData = await mongoHelper.getData(searchObj, "like_data");
      // console.log("getdata", getData);
      b.b_likedByMe = getData && getData.length > 0 ? 1 : 0;
    }

    // console.log("Processed news:", news);
    // console.log("Processed blog:", blog);
    let combinedData = [
      ...news.map((item) => ({
        n_id: item._id,
        n_uuid: item.n_uuid,
        n_title: item.n_title,
        n_content: item.n_content,
        n_description: item.n_description,
        n_subTitle: item.n_subTitle,
        n_image: item.n_image,
        n_avgRating: item.n_avgRating,
        n_commentCount: item.n_commentCount,
        n_likeCount: item.n_likeCount,
        n_active: item.n_active,
        n_deleted: item.n_deleted,
        n_created: item.n_created,
        n_updated: item.n_updated,
        n_type: "NEWS",
        n_adminName: adminUsersMap[item.n_adminId]?.name || "Unknown",
        n_role:
          adminUsersMap[item.n_adminId]?.role === "SUPER_ADMIN"
            ? "Super Admin"
            : adminUsersMap[item.n_adminId]?.role === "ADMIN"
            ? "Admin"
            : adminUsersMap[item.n_adminId]?.role === "MANAGER"
            ? "Manager"
            : adminUsersMap[item.n_adminId]?.role === "EDITOR"
            ? "Editor"
            : "",
        n_adminImage: adminUsersMap[item.n_adminId]?.image || "",
        n_likedByMe: item.n_likedByMe,
      })),
      ...blog.map((item) => ({
        n_id: item._id,
        n_uuid: item.b_uuid,
        n_title: item.b_title,
        n_content: item.b_content,
        n_description: item.b_description,
        n_subTitle: item.b_subTitle,
        n_image: item.b_image,
        n_avgRating: item.b_avgRating,
        n_commentCount: item.b_commentCount,
        n_likeCount: item.b_likeCount,
        n_active: item.b_active,
        n_deleted: item.b_deleted,
        n_created: item.b_created,
        n_updated: item.b_updated,
        n_type: "BLOG",
        n_adminName: adminUsersMap[item.b_adminId]?.name || "Unknown",
        n_role:
          adminUsersMap[item.b_adminId]?.role === "SUPER_ADMIN"
            ? "Super Admin"
            : adminUsersMap[item.b_adminId]?.role === "ADMIN"
            ? "Admin"
            : adminUsersMap[item.b_adminId]?.role === "MANAGER"
            ? "Manager"
            : adminUsersMap[item.b_adminId]?.role === "EDITOR"
            ? "Editor"
            : "",
        n_adminImage: adminUsersMap[item.b_adminId]?.image || "",
        n_likedByMe: item.b_likedByMe,
      })),
    ];

    combinedData.sort((a, b) => new Date(b.n_created) - new Date(a.n_created));

    // console.log("Combined and sorted data:", combinedData);

    const totalCount = combinedData.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1) * pageSize;
    const paginatedData = combinedData.slice(skip, skip + pageSize);

    // console.log("Paginated data:", paginatedData);
    // console.log("Current page:", page);
    // console.log("Total pages:", totalPages);
    // console.log("Total items:", totalCount);

    const response = {
      data: paginatedData,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
    };

    return response;
  } catch (error) {
    // console.error("Error in eventModel.getHomeData:", error);
    throw error;
  }
};

// /**
//  * get home page combined data
//  * @param     :
//  * @developer   : Manjeet Thakur
//  */
// eventModel.getCombinedData = async (body) => {
//   try {
//     if (!body) {
//       // console.log("Invalid request body");
//       return { error: "Invalid request body", code: 400 };
//     }

//     const page = parseInt(body.page);
//     const pageSize = parseInt(body.pageSize);

//     if (isNaN(page) || isNaN(pageSize) || pageSize < 1) {
//       return { error: "Invalid page or pageSize", code: 200 };
//     }

//     const newsSearchObj = { n_deleted: "0" };
//     const blogSearchObj = { b_deleted: "0" };

//     const [newsData, blogData] = await Promise.all([
//       mongoHelper.getData(newsSearchObj, "news"),
//       mongoHelper.getData(blogSearchObj, "blog"),
//     ]);

//     if (newsData.length === 0 && blogData.length === 0) {
//       // console.log("No data found");
//       return { data: [], currentPage: 0, totalPages: 0, totalItems: 0 };
//     }

//     // Function to fetch details based on UUID
//     const fetchDetails = async (item, collection) => {
//       const uuidField = collection === "news" ? "n_uuid" : "b_uuid";
//       const detailsObj = { [uuidField]: item[uuidField] };
//       const details = await mongoHelper.getData(detailsObj, collection);
//       return details.length > 0 ? details[0] : null;
//     };

//     // Enrich combinedData with details
//     const enrichData = async (data, collection) => {
//       for (const item of data) {
//         item.details = await fetchDetails(item, collection);
//       }
//     };

//     // Enrich newsData and blogData with details
//     await Promise.all([
//       enrichData(newsData, "news"),
//       enrichData(blogData, "blog"),
//     ]);

//     // Combine newsData and blogData into combinedData
//     let combinedData = [...newsData, ...blogData];

//     const totalCount = combinedData.length;
//     const totalPages = Math.ceil(totalCount / pageSize);
//     const skip = (page - 1) * pageSize;
//     const paginatedData = combinedData.slice(skip, skip + pageSize);

//     const response = {
//       data: paginatedData,
//       currentPage: page,
//       totalPages: totalPages,
//       totalItems: totalCount,
//     };

//     // console.log(response);
//     return response;
//   } catch (error) {
//     // console.error("Error in getCombinedData:", error);
//     return { error: "Internal server error", code: 500 };
//   }
// };

/**
 * for upload event Image
 * @param   :
 * @developer   : Manjeet Thakur
 */
eventModel.uploadReciptPdf = async function (eventId, fileName) {
  // console.log("executed");
  let deferred = q.defer();
  if (eventId && fileName) {
    let selectObj = {
      e_id: eventId,
    };
    let updateObj = {
      reciept: fileName,
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "notifications",
      updateObj
    );

    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for sendMail of reciept
 * @param    :
 * @developer    : Manjeet Thakur
 */
eventModel.sendRecieptEmail = async function (email, fileName) {
  let deferred = q.defer();

  let emailArray = {
    to: email,
    from: "Dama App <mailto:anoop.zeroit@gmail.com>",
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
eventModel.generalMail = async function (emailData) {
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
module.exports = eventModel;
