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
'use strict';
const chatBitcoinControllerObj = require('./application/controllers/chat'),
    socketConstant = require('../common/config/socket_constant'),
    constantEmit = socketConstant.EMIT;

let obj = {};

obj.init = function (socket, dataObj) {
    if (dataObj && dataObj.type && dataObj.data && dataObj.type.chat) {
        switch (dataObj.type.chat) {

            case 'CON-ROOM-JOIN-LEAVE':
                obj.conRoomJoinLeave(socket, dataObj.data);
                break;
            case 'CON-MESSAGE':
                obj.conChatMessage(socket, dataObj.data);

                break;
            default:
                socket.emit(constantEmit.MAIN_EMIT, {
                    action: 'ERROR'
                });
        }
    } else {
        socket.emit(constantEmit.MAIN_EMIT, {
            action: 'ERROR'
        })
    }
}

/**
 * 
 * @param: 
 * @returns:
 * @developer :  
 */
obj.conRoomJoinLeave = async function (socket, data) {
    let res = await chatBitcoinControllerObj.conRoomJoinLeave(socket, data);
    send(socket, res);
}



/**
 * 
 * @param: 
 * @returns:
 * @developer :  
 */
obj.conChatMessage = async function (socket, data) {
    let res = await chatBitcoinControllerObj.oneToOneMessage(socket, data);
    send(socket, res);

    let resOne = await chatBitcoinControllerObj.newMessageReceive(data);
    send(socket, resOne);

}

/**
 * 
 * @param: 
 * @returns:
 * @developer :  
 */
obj.questionAnswerMessage = async function (socket, data) {
    let res = await chatBitcoinControllerObj.questionAnswerMessage(socket, data);
    send(socket, res);
}


/**
 * 
 * @param: 
 * @returns:
 * @developer :  Diksha
 */
obj.groupChatMessage = async function (socket, data) {
    let res = await chatBitcoinControllerObj.groupChatMessage(socket, data);
    send(socket, res);
    let resOne = await chatBitcoinControllerObj.groupNewMessageReceive(data);
    send(socket, resOne);
}
/**
 * 
 * @param: 
 * @returns:
 * @developer :  Diksha
 */
obj.groupChatRoomJoinLeave = async function (socket, data) {
    let res = await chatBitcoinControllerObj.groupChatRoomJoinLeave(socket, data);
    send(socket, res);

}

/**
 * 
 * @param: 
 * @returns:
 * @developer :  
 */

function send(socket, data) {

    //let socket = (socketObj && socketObj != '') ? socketObj : io;

    if (socket) {

        if (data && data.emit) {

            if (data.to) {
                data.to.forEach(function (row) {

                    socket.to(row.uc_socket_id).emit(constantEmit.MAIN_EMIT, data.emit);

                });
                //socket.to(data.to).emit(constantEmit.MAIN_EMIT, data.emit);
            }

            if (data.own) {
                if (data.ownData && data.ownData != '') {
                    data.emit.data = data.ownData;
                    if (data.ownAction) {
                        data.emit.action = data.ownAction;
                    }
                    socket.emit(constantEmit.MAIN_EMIT, data.emit);
                } else {
                    socket.emit(constantEmit.MAIN_EMIT, data.emit);
                }

            }

        } else {

        }
    }

}
/**
 * 
 * @param: 
 * @returns:
 * @developer :  Diksha
 */
obj.groupQuestionChatRoomJoinLeave = async function (socket, data) {
    let res = await chatBitcoinControllerObj.groupQuestionChatRoomJoinLeave(socket, data);
    send(socket, res);

}

module.exports = obj;