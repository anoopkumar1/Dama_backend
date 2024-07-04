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

const newModelObj = {},
      mongoHelper = require('../helpers/mongo_helper'),
      q           = require('q');



newModelObj.newUser = async function(dataObj){
    let deferred = q.defer();

    if ( dataObj.uc_uuid && dataObj.socketId && dataObj.devicePlatform && dataObj.deviceId ) {
        
        let insertValue = {
                "uc_fk_uc_uuid"   : dataObj.uc_uuid, 
                "uc_socket_id"    : dataObj.socketId ,
                "uc_fcm_token"    : dataObj.fcmToken || null,
                "uc_device_id"    : dataObj.deviceId ,
                "uc_device_type"  : 'W',
                "uc_platform"     : dataObj.devicePlatform,
            };
        if ( dataObj.devicePlatform && (dataObj.devicePlatform == 'Android' || dataObj.devicePlatform == 'iOS')){
            insertValue.uc_device_type = 'M';
        }
        await newModelObj.deleteDeviceData({userId:dataObj.uc_uuid});
        //await newModelObj.deleteSocketId({"socketId": dataObj.socketId});

        let insertData = await mongoHelper.insert( insertValue , 'users_connections');

        if ( insertData ) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;

}

newModelObj.getUserSocketId = async function(userUuid , ownId = false) {
    let deferred = q.defer();

    if ( userUuid && userUuid != '') { 

        let obj         = {};

        if ( ownId ) {

            obj = { $or: [
                { uc_fk_uc_uuid: userUuid },
                { uc_fk_uc_uuid: ownId },
            ]};

        } else {

            obj = {
                uc_fk_uc_uuid: userUuid
            };

        }

        let getData     = await mongoHelper.getData( obj ,'users_connections');

        if ( getData ) {
            deferred.resolve(getData);
        } else {
            deferred.resolve([]);
        }
    }
    return deferred.promise;
}

/**
 * Used to get user device tokens.
 * @developer   : 
 * @modified    : 
 */
newModelObj.getOwnSocketIdOtherDevices = async function(userUuid , socketId) {
    let deferred = q.defer();
    
    if ( userUuid && userUuid != '') {

        let obj         = {
            uc_fk_uc_uuid : userUuid ,
            uc_socket_id :  { $ne : socketId }
        };

        let getData     = await mongoHelper.getData( obj ,'users_connections');

        if ( getData ) {
            deferred.resolve(getData);
        } else {
            deferred.resolve([]);
        }
    }

    return deferred.promise;

}

/**
 * Used to get user device tokens.
 * @developer   : 
 * @modified    : 
 */
newModelObj.getUserDeviceTokens = async function(userId,bundleId = '') {
    
    let deferred = q.defer();
    
    if ( userId ) {

        let obj = {
            ud_fk_uc_id : userId
        };
        let  getData = await mongoHelper.getData(obj ,'user_devices');
            
        if ( getData && getData.length > 0 ) {
            deferred.resolve(getData);
        } else {
            deferred.resolve([]);
        }
        
    } else {
        deferred.resolve([]);
    }
    return deferred.promise;
}
/**
 * Used to get user device tokens.
 * @developer   : 
 * @modified    : 
 */
newModelObj.deleteSocketId = async function( dataObj ){
    let deferred     = q.defer();

    if ( dataObj && dataObj.socketId && dataObj.socketId != '' ) {

        let obj         = {
            uc_socket_id :  dataObj.socketId
        },
        deleteData  = await mongoHelper.deleteData( obj,'users_connections');
        if ( deleteData ) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }

       
    }
    return deferred.promise;
}
/**
 * Used to get user device tokens.
 * @developer   : 
 * @modified    : 
 */
newModelObj.deleteDeviceData = async function( dataObj ) {
    let deferred     = q.defer();

    if ( dataObj && dataObj.userId ) {

        let obj         = {
                uc_fk_uc_uuid :  dataObj.userId
            },
            deleteData  = await mongoHelper.deleteAllData( obj,'users_connections');
        if ( deleteData ) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    }
    return deferred.promise;
}



module.exports = newModelObj;