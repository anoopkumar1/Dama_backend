/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Diksha Jaswal <dikshaj.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */


const q = require('q');
const mongoHelper = require("./mongo_helper");
    jwt = require('jsonwebtoken');

let helper = {};
/**
* This helper is used to return common error object.
* @developer :
* @modified  : 
*/
helper.errorListener = function () {

    let returnObj = {
        emit: {
            action: 'ERROR',
            data: {
                message: 'Something went wrong!'
            }
        }
    };
    return returnObj;
}


/**
* This helper is used to return common error object.
* @developer : 
* @modified  : 
*/
helper.commonListener = function (socket) {

    let socketCommon = socket.emit('call', {
        action: 'INFO',
        data: {
            message: 'Something went wrong!'
        }
    });
    return socketCommon;
}
/**
 * 
 * @param     : 
 * @returns   :
 * @developer :  
*/
helper.isAuthentication = function (socket = {}, data = {}) {
    let returnOb = {},
        token = '';
    if (socket && socket.handshake && socket.handshake.query && socket.handshake.query.token) {
        token = socket.handshake.query.token;
    } else if (data && data.token) {
        token = data.token;
    }
    if (token && token != 'null' && token != null) {

        let decoded = jwt.verify(token, '@&*(29783-d4343daf4dd*&@&^#^&@#');

        if (decoded && (decoded.userId || decoded.orgId)) {

            if (decoded.userId) {
                decoded.uc_uuid = decoded.userId;
                decoded.userId = decoded.userId;
            }

            if (decoded.orgId) {
                decoded.userId = decoded.orgId;
            }

            if (socket.handshake.query && socket.handshake.query.fcmToken && socket.handshake.query.devicePlatform && socket.handshake.query.deviceId) {

                decoded.fcmToken = socket.handshake.query.fcmToken;
                decoded.bundleId = socket.handshake.query.bundleId;
                decoded.deviceId = socket.handshake.query.deviceId;
                decoded.devicePlatform = socket.handshake.query.devicePlatform;

            } else if (data.fcmToken && data.devicePlatform && data.deviceId) {

                decoded.fcmToken = data.fcmToken;
                decoded.bundleId = data.bundleId;
                decoded.deviceId = data.deviceId;
                decoded.devicePlatform = data.devicePlatform;

            }

            returnOb = decoded;

        }

    }

    return returnOb;

}

/**
* 
* @param     : 
* @returns   :
* @developer :  
*/
helper.logs = async function (data, socket = io) {
    socket.emit('logs', data);
}
/**
* 
* @param     : 
* @returns   :
* @developer :  
*/
helper.emitDataObj = async function (action = '', data = '', to = [], own = false, ownData = '', ownAction = false) {

    let obj = {
        emit: {
            action: 'ERROR',
            data: {
                message: 'Something went wrong!'
            },
        },
        to: to,
        own: own,
        ownData: ownData,
        ownAction: ownAction

    }

    if (action != '') {
        obj.emit.action = action;
    }

    if (data != '') {
        obj.emit.data = data;
    }

    return obj;

}


/**
* This helper is using to get utc time
* @param     : 
* @returns   : 
* @developer : 
*/
helper.getUtcTime = async function () {

    let utcTime = new Date(new Date().toUTCString());

    return utcTime;
}
/**
* This helper is using to get utc time
* @param     : 
* @returns   : 
* @developer : 
*/
helper.deliverStatus = async function (loginId, receiverId) {

    let defered = q.defer();

    if (loginId && receiverId) {
        let selectObj = {
            usb_fk_uc_uuid: receiverId,
            usb_block_fk_uc_uuid: loginId,
        };
        let res = await mongoHelper.getData(selectObj, "users_block");
        if (res.length > 0) {
            defered.resolve('0');
        } else {
            defered.resolve('1');
        }

    } else {
        defered.resolve('1');
    }

    return defered.promise;
}
module.exports = helper;