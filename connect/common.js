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
const common_controller     = require('./application/controllers/common'),
    helper                  = require('./application/helpers/');

let obj = {};
obj.init = function(socket) {
    socket.on('new', function (newData) {


        let userAthuntication = helper.isAuthentication( socket , newData);
        if ( userAthuntication && userAthuntication.uc_uuid ) {
            common_controller.newUser(socket , userAthuntication);
        }
        
    });
    
    socket.on('disconnect', function () {
        //common_controller.updateBothUserOngoingCallStatus(socket);
       
    });
    //kurentoNewObj.init(socket);
}
module.exports = obj;