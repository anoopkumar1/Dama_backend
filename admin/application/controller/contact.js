/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
* 
* Written By  : anoop kumar <mailto:anoop.zeroit@gmail.com>, June 2024
* Description :
* Modified By :
*/

const { exit } = require("process");
const helper = require("../helpers/index"),
  fs = require('fs'),
  path = require('path'),
  Busboy = require('busboy'),

  mongoHelper = require('../helpers/mongo_helper'),
  constants = require('../../../common/config/constants'),
  commonModel = require("../model/common_model"),
  contactModel = require("../model/contact_model");
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
let contactObj = {}
/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
contactObj.insertContact = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (
      req &&
      req.body &&
      req.body.userMessage &&
      req.body.contentType
    ) {
      let result = await contactModel.insertContact(req.body, user.userId);
      helper.successHandler(res, {});
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};


contactObj.get_contact = async function (req, res) {
  const user = helper.getUidByToken(req);
  const id = req.params.id;
  const selectObj = { dc_uuid: id };

  if (id && user.userId) {
    const data = await mongoHelper.getRow(selectObj, "dama_content");
    if (data) {
      return helper.successHandler(res, {
        payload: data
      });
    }
  }

  return helper.errorHandler(res, {
    code: "ASL-E1002",
    message: "Unauthorized Error.",
    status: false,
  });

};


/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
contactObj.deleteContact = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {
    if (req && req.body && req.body.contactId) {
      let result = await contactModel.deleteContact(req.body);

      helper.successHandler(res, {});
    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
    }
  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};


/**
 * This function is using to
 * @param     :
 * @returns   :
 * @developer :
 */
contactObj.deleteContact = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {

    if (req && req.body && req.body.userId) {

      let result = await contactModel.deleteContact(req.body, user.userId);

      helper.successHandler(res, {});

    } else {
      helper.errorHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });
    }

  } else {

    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });

  }

};


contactObj.contactListAjax = async function (req, res) {
  let user = helper.getUidByToken(req);
  if (user && user.userId) {
    let result = await contactModel.getcontactList(req.body);
    res.render('contactListAjax', {
      req: req,
      data: result,
    });

  } else {
    helper.errorHandler(res, {
      code: 'ASL-E1002',
      message: 'Unauthorized Error.',
      status: false
    });
  }
}

/**
 * This is using to
 * @param       :
 * @returns     :
 * @developer   :
 */
contactObj.editContact = async function (req, res) {
  let user = helper.getUidByToken(req);

  if (user && user.userId) {

    if (req.body && req.body.contentType && req.body.userMessage) {

      let result = await contactModel.editContact(req.body, user.userId);
      if (result) {
        helper.successHandler(res, {
          payload: 'update success.'
        });
      } else {
        helper.successHandler(res, {
          code: "ASL-E1002",
          message: "Please fill manadatory fields.",
          status: false,
        });
      }

    } else {

      helper.successHandler(res, {
        code: "ASL-E1002",
        message: "Please fill manadatory fields.",
        status: false,
      });

    }

  } else {
    helper.errorHandler(res, {
      code: "ASL-E1002",
      message: "Unauthorized Error.",
      status: false,
    });
  }
};
module.exports = contactObj;
