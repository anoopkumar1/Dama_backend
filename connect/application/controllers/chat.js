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

const helper = require('../helpers'),
    commonModel = require('../models/common_model'),
    mongoHelper = require('../helpers/mongo_helper'),
    appCommonModel = require('../../../app/application/model/common_model'),
    chatModel = require('../models/chat_model');


let chatObj = {};

/**
 * 
 * @param     : 
 * @returns   :
 * @developer : 
 */
chatObj.conRoomJoinLeave = async function (socket, data) {

    let returnObj = helper.emitDataObj('ERROR');

    if (data && data.conversationId) {

        if (data.requestFor) {

            if (data.requestFor == 'JOIN') {
                socket.join(data.conversationId);
            } else {
                socket.leave(data.conversationId);
            }

        }

        returnObj = helper.emitDataObj('CON-ROOM-JOIN-LEAVE', data, [], true);

    }

    return returnObj;
}




/**
 * 
 * @param     : 
 * @returns   :
 * @developer :
 */
chatObj.oneToOneMessage = async function (socket, data) {

    let returnObj = helper.emitDataObj('ERROR');

    if (data && data.conversationId && data.receiverId) {

        if (data) {

            let result = await chatModel.saveOneToOneChat(data);

            let userToken = {
                uc_fk_uc_uuid: data.receiverId,
            };

            let userData = await mongoHelper.getData(userToken, 'users_connections');


            if (userData && userData.length > 0) {

                let array = [];

                array.push(userData[0].uc_fcm_token);

                let userObj = {
                    uc_uuid: data.receiverId,
                };

                let userDataOne = await mongoHelper.getData(userObj, 'users_credential');
                let userName = '';

                if (userDataOne && userDataOne.length > 0) {
                    userName = userDataOne[0].uc_name;
                }

                let orderObj = {
                    uod_uuid: data.conversationId,
                };

                let orderData = await mongoHelper.getData(orderObj, 'users_orders_details');
                let orderId = '';

                if (orderData && orderData.length > 0) {
                    orderId = orderData[0].uod_fk_uo_uuid;
                }

                let messageObj = {
                    notification: {
                        title: 'New Message',
                        body: data.message,
                        sound: "notification.wav",
                        badge: "1",
                        priority: 'high',
                        android_channel_id: 'high_importance_channel'
                    },
                    data: {
                        title: 'New Message',
                        score: '850',
                        click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        conversationId: data.conversationId,
                        orderId: orderId,
                        receiverId: data.receiverId,
                        receiverName: userName,

                    },

                    registration_ids: array,
                };

                appCommonModel.sendNotificationFCM(messageObj, data.receiverId);
            }

            appCommonModel.sendChatCount(data.receiverId, result);

            let toSocketIds = [{ uc_socket_id: data.conversationId }];
            returnObj = helper.emitDataObj('CON-MESSAGE', data, toSocketIds, true);


        }

    }
    return returnObj;
}
/**
 * For accept the call.
 * @developer : 
 * @modified  : 
 */
chatObj.newMessageReceive = async function (data) {
    let returnObj = '';

    if (data && data.recUserUuId) {
        let toSocketIds = await chatObj.getUserSocketIds(data.recUserUuId);

        if (toSocketIds && toSocketIds.length > 0) {

            returnObj = await helper.emitDataObj('NEW-MESSAGE', {}, toSocketIds, true);

        }
    }
    return returnObj;
}
/**
 * 
 * @param     : 
 * @returns   :
 * @developer : 
 */
chatObj.getUserSocketIds = async function (userId, ownId = false) {
    let userSocketIds = [];
    if (userId && userId != '') {
        userSocketIds = await commonModel.getUserSocketId(userId, ownId);
    }
    return await userSocketIds;
}

module.exports = chatObj;