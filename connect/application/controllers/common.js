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
const commonObj = {},
    common_model = require('../models/common_model');


commonObj.newUser = async function (socket, data) {
    if (data && data.uc_uuid && socket.id) {
        data.socketId = socket.id;
        let result = await common_model.newUser(data);
    }
}

commonObj.deleteUserSocket = async function (socketId) {
    if (socketId && socketId != '') {
        let sendingObj = {
            socketId: socketId
        }
        await common_model.deleteSocketId(sendingObj);
    }
}

module.exports = commonObj;