const { async, defer } = require("q");

const crypto = require("crypto"),
  passwordHash = require("password-hash"),
  constants = require("../../../common/config/constants"),
  { v4 } = require("uuid"),
  helper = require("../helpers/index"),
  mongoHelper = require("../helpers/mongo_helper");
const bcrypt = require("bcrypt");

const memberModel = {};

/**
 * this is using for create meber
 * @param    :
 * @developer   : Manjeet Thakur
 */

memberModel.createMember = async function (body) {
  console.log("body", body);
  let insertObj;
  let uuid = v4(Date.now());
  let date = await helper.getUtcTime();

  try {
    const hashPassword = await bcrypt.hash(body.password, 15);

    let modulesWithSubModules = [];
    let data = [];
    if (body.module) {
      const moduleArray = Array.isArray(body.module)
        ? body.module
        : [body.module];
      moduleArray.forEach((mainModule, index) => {
        const subModules = body[`${mainModule.toLowerCase()}-action`];
        modulesWithSubModules.push({ mainModule, subModules });
      });

      insertObj = {
        au_uuid: uuid,
        au_firstname: body.firstName,
        au_lastname: body.lastName,
        au_email: body.userEmail,
        au_password: hashPassword,
        au_mobile: body.phoneField,
        au_created: date,
        au_updated: date,
        au_active: "1",
        au_deleted: "0",
        au_profileImage: "",
        au_role: body.role,
        au_modules: modulesWithSubModules,
      };
    } else {
      insertObj = {
        au_uuid: uuid,
        au_firstname: body.firstName,
        au_lastname: body.lastName,
        au_email: body.userEmail,
        au_password: hashPassword,
        au_mobile: body.phoneField,
        au_created: date,
        au_updated: date,
        au_active: "1",
        au_deleted: "0",
        au_role: body.role,
        au_profileImage: "",
      };
    }

    console.log("modulesWithSubModules:", modulesWithSubModules);

    let result = await mongoHelper.insert(insertObj, "admin_users");
    console.log(result);
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * this is using for upload member profile image
 * @param    :
 * @developer    :Manjeet Thakur
 */
memberModel.uploadProfileImage = async function (memberUuid, fileName) {
  let deferred = q.defer();
  if (memberUuid && fileName) {
    let selectObj = {
      au_uuid: memberUuid,
    };
    let updateObj = {
      au_profileImage: fileName,
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "admin_users",
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
 * this is using for edit member
 *
 * @param   :
 * @developer   :Manjeet Thakur
 */
memberModel.editMember = async (body) => {
  try {
    let updateObj;
    let modulesWithSubModules = [];

    if (body.module && body.role) {
      body.module.forEach((mainModule, index) => {
        const subModules = body[`${mainModule.toLowerCase()}-action`];
        modulesWithSubModules.push({ mainModule, subModules });
      });

      updateObj = {
        au_firstname: body.firstName,
        au_lastname: body.lastName,
        au_email: body.email,
        // au_mobile: body.phone,
        au_role: body.role,
        au_modules: modulesWithSubModules,
      };
    } else {
      updateObj = {
        au_firstname: body.firstName,
        au_lastname: body.lastName,
        au_email: body.email,
        // au_mobile: body.phone,
      };
    }

    let selectObj = {
      au_uuid: body.memberUuid,
    };

    let result = await mongoHelper.updateData(
      selectObj,
      "admin_users",
      updateObj
    );

    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * This is using for delete member
 * @param    :
 * @developer   : Manjeet Thakur
 */
memberModel.deleteMember = async (body) => {
  try {
    let deferred = q.defer();
    let selectObj = {
      au_uuid: body.memberUuid,
    };
    let updateObj = {
      au_deleted: "1",
    };
    let result = await mongoHelper.updateData(
      selectObj,
      "admin_users",
      updateObj
    );
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * This function is using active menmber
 * @param     :
 * @returns   :
 * @developer : Anoop Kumar
 */
memberModel.activateMember = async function (body) {

  if (body.userId) {
    let selectObj = {
      au_uuid: body.userId,
    };
    let updateObj = {
        au_active: "1",
      },
      result = await mongoHelper.updateData(
        selectObj,
        "admin_users",
        updateObj
      );
    console.log(result, "0000000000000000000000000000000");

    if (result) {
      return result;
    } else {
      deferred.resolve(false);
    }
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is using
 * @param     :
 * @returns   :
 * @developer : Anoop Kumar
 */
memberModel.deactivateMember = async function (body) {

  if (body.userId) {
    let selectObj = {
      au_uuid: body.userId,
    };
    let updateObj = {
        au_active: "0",
      },
      result = await mongoHelper.updateData(
        selectObj,
        "admin_users",
        updateObj
      );

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  return deferred.promise;
};
module.exports = memberModel;
