const { async, defer } = require("q");
const q = require("q"),
  passwordHash = require("password-hash"),
  constants = require("../../../common/config/constants"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");

const eventModel = {};
/**
 * Insert event
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
eventModel.insertEvent = async function (body, userId) {
  let deferred = q.defer();

  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let eventUuid = v4(Date.now());
    let insertObj = {
      e_uuid: eventUuid,
      e_adminId: userId,
      e_title: body.title,
      e_content: body.content,
      e_description: body.desc,
      e_duplicateDesc: duplicateValue,
      e_subTitle: body.subTitle,
      e_startDate: body.startDate,
      e_endDate: body.endDate,
      e_venue: body.venue,
      e_latitude: body.lat,
      e_logitude: body.long,
      e_paidStatus: body.isPaid,
      e_price: body.price,
      e_image: [],
      e_avgRating: 0,
      e_active: "1",
      e_deleted: "0",
      e_created: date,
      e_updated: date,
    };
    let results = await mongoHelper.insert(insertObj, "event");
    if (results) {
      deferred.resolve(eventUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * uploadImage
 * @param     :
 * @returns   :
 * @developer : Sangeeta
 */
eventModel.uploadMultipleEventImage = async function (eventUuid, fileName) {
  let deferred = q.defer();
  if (eventUuid && fileName) {
    let selectObj = {
      e_uuid: eventUuid,
    };

    let updateObj = {
      e_image: fileName,
    };
    let result = await mongoHelper.updateData(selectObj, "event", updateObj);

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
 * for edit event
 * @param    :
 * @developer    : Sangeeta
 */
eventModel.editEvent = async function (body, userId) {
  let deferred = q.defer();

  if (body) {
    function cleanText(str) {
      let noHtml = str.replace(/<[^>]*>/g, "");
      let cleanStr = noHtml.replace(/\r?\n|\r/g, " ");
      return cleanStr;
    }
    let duplicateValue = cleanText(body.desc);
    let date = await helper.getUtcTime();
    let selectObj = {
      e_uuid: body.eventId,
    };
    let editObj = {
      e_title: body.title,
      e_content: body.content,
      e_description: body.desc,
      e_duplicateDesc: duplicateValue,
      e_subTitle: body.subTitle,
      e_startDate: body.startDate,
      e_endDate: body.endDate,
      e_venue: body.venue,
      e_latitude: body.lat,
      e_logitude: body.long,
      e_price: body.price,
      e_created: date,
      e_updated: date,
      e_paidStatus: body.isPaid,
    };
    let results = await mongoHelper.updateData(selectObj, "event", editObj);
    if (results) {
      deferred.resolve(results);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for delete event
 * @param    :
 * @developer    : Sangeeta
 */

eventModel.deleteEvent = async function (body) {
  let deferred = q.defer();
  console.log("eventId", body.eventId);
  if (body.eventId) {
    let date = await helper.getUtcTime();
    let eventUuid = v4(Date.now());
    let selectObj = {
      e_uuid: body.eventId,
    };
    let editObj = {
      e_deleted: "1",
    };
    let results = await mongoHelper.updateData(selectObj, "event", editObj);
    if (results) {
      deferred.resolve(eventUuid);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

/**
 * for get all event
 * @param   :
 * @developer   : Sangeeta
 */
eventModel.getEventlist = async function (body) {
  let deferred = q.defer();

  if (body) {
    let date = await helper.getUtcTime();
    let eventUuid = v4(Date.now());

    let selectObj = {
      e_deleted: "0",
    };
    let results = await mongoHelper.getData(selectObj, "event");
    if (results) {
      deferred.resolve(results);
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

eventModel.getEventlist = async function (body) {
  let deferred = q.defer();
  let EventObj = {
    e_deleted: "0",
  };
  let eventArray = await mongoHelper.geteventListData(EventObj, "event", body);
  if (eventArray && eventArray.data && eventArray.data.length > 0) {
    for (const result of eventArray.data) {
      result.e_created = helper.dateFormat(result.e_created, "date");
    }

    deferred.resolve(eventArray);
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

/**
 * for upload speaker image
 * @param   :
 * @developer    : Manjeet Thakur
 */
eventModel.uploadMultiplespeakerImage = async function (eventUuid, fileName) {
  let deferred = q.defer();
  if (eventUuid && fileName) {
    let selectObj = {
      e_s_uuid: eventUuid,
    };
    console.log(selectObj, "selectopbj");
    let updateObj = {
      e_s_speakerImage: fileName,
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "event_speaker",
      updateObj
    );
    console.log(result, "result");
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
 * for add event Speaker
 * @param  :
 * @developer   : Manjeet Thakur
 */
eventModel.addSpeaker = async (eventId, speakerName) => {
  try {
    let insertObj = {
      e_s_uuid: eventId,
      e_s_name: speakerName,
      e_s_speakerImage: "",
    };
    let result = await mongoHelper.insert(insertObj, "event_speaker");
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = eventModel;
